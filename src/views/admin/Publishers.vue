<!-- src/views/admin/Publishers.vue -->
<template>
    <div class="admin-publishers">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="page-title mb-0">Quản lý nhà xuất bản</h1>
            <router-link to="/admin/publishers/add" class="btn btn-success">
                <i class="fas fa-plus mr-1"></i> Thêm nhà xuất bản
            </router-link>
        </div>

        <div class="card">
            <div class="card-header bg-primary text-white">
                <div class="d-flex justify-content-between align-items-center">
                    <h4 class="mb-0">Danh sách nhà xuất bản</h4>
                    <div class="form-inline">
                        <div class="input-group">
                            <input type="text" class="form-control" placeholder="Tìm kiếm..." v-model="searchText"
                                @keyup.enter="searchPublishers">
                            <div class="input-group-append">
                                <button class="btn btn-light" type="button" @click="searchPublishers">
                                    <i class="fas fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div v-if="loading" class="text-center my-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                    <p class="mt-2">Đang tải danh sách nhà xuất bản...</p>
                </div>

                <div v-else-if="filteredPublishers.length === 0" class="alert alert-info">
                    Không tìm thấy nhà xuất bản nào. Vui lòng thử tìm kiếm với từ khóa khác hoặc thêm nhà xuất bản mới.
                </div>

                <div v-else class="table-responsive">
                    <table class="table table-bordered table-hover">
                        <thead class="thead-light">
                            <tr>
                                <th>Tên nhà xuất bản</th>
                                <th>Địa chỉ</th>
                                <th>Số lượng sách</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="publisher in filteredPublishers" :key="publisher._id">
                                <td>{{ publisher.tenNXB }}</td>
                                <td>{{ publisher.diaChi || 'Không có thông tin' }}</td>
                                <td>{{ getBookCount(publisher._id) }}</td>
                                <td>
                                    <div class="btn-group">
                                        <router-link
                                            :to="{ name: 'admin-publisher-edit', params: { id: publisher._id } }"
                                            class="btn btn-sm btn-info">
                                            <i class="fas fa-edit"></i>
                                        </router-link>
                                        <button class="btn btn-sm btn-danger" @click="confirmDelete(publisher)">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="deleteModalLabel"
            aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-danger text-white">
                        <h5 class="modal-title" id="deleteModalLabel">Xác nhận xóa</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" v-if="publisherToDelete">
                        <p>Bạn có chắc chắn muốn xóa nhà xuất bản "{{ publisherToDelete.tenNXB }}"?</p>
                        <p class="text-danger"><strong>Lưu ý:</strong> Hành động này có thể ảnh hưởng đến các sách thuộc
                            nhà xuất bản này!</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Hủy</button>
                        <button type="button" class="btn btn-danger" @click="deletePublisher">Xóa</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AuthService from "@/services/auth.service";
import NhaXuatBanService from "@/services/nhaxuatban.service";
import SachService from "@/services/sach.service";
import $ from 'jquery';

export default {
    name: "AdminPublishers",
    data() {
        return {
            publishers: [],
            books: [],
            loading: true,
            searchText: "",
            publisherToDelete: null
        };
    },
    computed: {
        filteredPublishers() {
            if (!this.searchText) return this.publishers;

            const searchLower = this.searchText.toLowerCase();
            return this.publishers.filter(publisher =>
                publisher.tenNXB.toLowerCase().includes(searchLower) ||
                (publisher.diaChi && publisher.diaChi.toLowerCase().includes(searchLower))
            );
        }
    },
    methods: {
        getBookCount(publisherId) {
            return this.books.filter(book => book.maNXB === publisherId).length;
        },
        async loadData() {
            this.loading = true;
            try {
                this.publishers = await NhaXuatBanService.getAll();
                this.books = await SachService.getAll();
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                this.loading = false;
            }
        },
        searchPublishers() {
            // The filteredPublishers computed property will handle the filtering
        },
        confirmDelete(publisher) {
            this.publisherToDelete = publisher;
            $('#deleteModal').modal('show');
        },
        async deletePublisher() {
            if (!this.publisherToDelete) return;

            try {
                await NhaXuatBanService.delete(this.publisherToDelete._id);
                $('#deleteModal').modal('hide');
                this.loadData(); // Reload the data
            } catch (error) {
                console.error("Error deleting publisher:", error);
                alert("Có lỗi xảy ra khi xóa nhà xuất bản. Vui lòng thử lại sau.");
            }
        }
    },
    created() {
        if (!AuthService.isAdmin()) {
            this.$router.push("/login");
            return;
        }
        this.loadData();
    }
};
</script>

<style scoped>
.table th,
.table td {
    vertical-align: middle;
}

.btn-group .btn {
    margin-right: 5px;
}

.btn-group .btn:last-child {
    margin-right: 0;
}
</style>