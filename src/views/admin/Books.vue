<template>
    <div class="admin-books">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="page-title mb-0">Quản lý sách</h1>
            <router-link to="/admin/books/add" class="btn btn-success">
                <i class="fas fa-plus mr-1"></i> Thêm sách mới
            </router-link>
        </div>

        <div class="card">
            <div class="card-header bg-primary text-white">
                <div class="d-flex justify-content-between align-items-center">
                    <h4 class="mb-0">Danh sách sách</h4>
                    <div class="form-inline">
                        <div class="input-group">
                            <input type="text" class="form-control" placeholder="Tìm kiếm..." v-model="searchText"
                                @keyup.enter="searchBooks">
                            <div class="input-group-append">
                                <button class="btn btn-light" type="button" @click="searchBooks">
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
                    <p class="mt-2">Đang tải danh sách sách...</p>
                </div>

                <div v-else-if="filteredBooks.length === 0" class="alert alert-info">
                    Không tìm thấy sách nào. Vui lòng thử tìm kiếm với từ khóa khác hoặc thêm sách mới.
                </div>

                <div v-else class="table-responsive">
                    <table class="table table-bordered table-hover">
                        <thead class="thead-light">
                            <tr>
                                <th>Ảnh bìa</th>
                                <th>Tên sách</th>
                                <th>Tác giả</th>
                                <th>Năm XB</th>
                                <th>Nhà xuất bản</th>
                                <th>Đơn giá</th>
                                <th>Số quyển</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="book in filteredBooks" :key="book._id">
                                <td class="text-center">
                                    <img :src="book.anhBia || '/img/default-book-cover.jpg'" class="book-thumbnail"
                                        :alt="book.tenSach">
                                </td>
                                <td>{{ book.tenSach }}</td>
                                <td>{{ book.nguonGocTacGia || 'N/A' }}</td>
                                <td>{{ book.namXuatBan || 'N/A' }}</td>
                                <td>{{ book.nhaXuatBan ? book.nhaXuatBan.tenNXB : 'N/A' }}</td>
                                <td>{{ formatCurrency(book.donGia) }}</td>
                                <td>{{ book.soQuyen || 0 }}</td>
                                <td>
                                    <div class="btn-group">
                                        <router-link :to="{ name: 'admin-book-edit', params: { id: book._id } }"
                                            class="btn btn-sm btn-info">
                                            <i class="fas fa-edit"></i>
                                        </router-link>
                                        <button class="btn btn-sm btn-danger" @click="confirmDelete(book)">
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
                    <div class="modal-body" v-if="bookToDelete">
                        <p>Bạn có chắc chắn muốn xóa sách "{{ bookToDelete.tenSach }}"?</p>
                        <p class="text-danger"><strong>Lưu ý:</strong> Hành động này không thể hoàn tác!</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Hủy</button>
                        <button type="button" class="btn btn-danger" @click="deleteBook">Xóa</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AuthService from "@/services/auth.service";
import SachService from "@/services/sach.service";
import $ from 'jquery';

export default {
    name: "AdminBooks",
    data() {
        return {
            books: [],
            loading: true,
            searchText: "",
            bookToDelete: null
        };
    },
    computed: {
        filteredBooks() {
            if (!this.searchText) return this.books;

            const searchLower = this.searchText.toLowerCase();
            return this.books.filter(book =>
                book.tenSach.toLowerCase().includes(searchLower) ||
                (book.nguonGocTacGia && book.nguonGocTacGia.toLowerCase().includes(searchLower)) ||
                (book.nhaXuatBan && book.nhaXuatBan.tenNXB.toLowerCase().includes(searchLower))
            );
        }
    },
    methods: {
        formatCurrency(value) {
            if (!value) return "0 VNĐ";
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
        },
        async loadBooks() {
            this.loading = true;
            try {
                this.books = await SachService.getAll();
            } catch (error) {
                console.error("Error loading books:", error);
            } finally {
                this.loading = false;
            }
        },
        searchBooks() {
            // The filteredBooks computed property will handle the filtering
        },
        confirmDelete(book) {
            this.bookToDelete = book;
            $('#deleteModal').modal('show');
        },
        async deleteBook() {
            if (!this.bookToDelete) return;

            try {
                await SachService.delete(this.bookToDelete._id);
                $('#deleteModal').modal('hide');
                this.loadBooks(); // Reload the books
            } catch (error) {
                console.error("Error deleting book:", error);
                alert("Có lỗi xảy ra khi xóa sách. Vui lòng thử lại sau.");
            }
        }
    },
    created() {
        if (!AuthService.isAdmin()) {
            this.$router.push("/login");
            return;
        }
        this.loadBooks();
    }
};
</script>

<style scoped>
.book-thumbnail {
    width: 50px;
    height: 70px;
    object-fit: cover;
}
</style>