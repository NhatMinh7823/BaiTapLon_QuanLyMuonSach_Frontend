<template>
    <div class="admin-users">
        <h1 class="page-title">Quản lý đọc giả</h1>

        <div class="card">
            <div class="card-header bg-primary text-white">
                <div class="d-flex justify-content-between align-items-center">
                    <h4 class="mb-0">Danh sách đọc giả</h4>
                    <div class="form-inline">
                        <div class="input-group">
                            <input type="text" class="form-control" placeholder="Tìm kiếm..." v-model="searchText"
                                @keyup.enter="searchUsers">
                            <div class="input-group-append">
                                <button class="btn btn-light" type="button" @click="searchUsers">
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
                    <p class="mt-2">Đang tải danh sách đọc giả...</p>
                </div>

                <div v-else-if="error" class="alert alert-danger">
                    {{ error }}
                </div>

                <div v-else-if="filteredUsers.length === 0" class="alert alert-info">
                    Không tìm thấy đọc giả nào.
                </div>

                <div v-else class="table-responsive">
                    <table class="table table-bordered table-hover">
                        <thead class="thead-light">
                            <tr>
                                <th>Họ tên</th>
                                <th>Email</th>
                                <th>Điện thoại</th>
                                <th>Địa chỉ</th>
                                <th>Giới tính</th>
                                <th>Ngày sinh</th>
                                <th>Số sách đang mượn</th>
                                <th>Tổng số lần mượn</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in filteredUsers" :key="user._id">
                                <td>{{ user.hoLot }} {{ user.ten }}</td>
                                <td>{{ user.email }}</td>
                                <td>{{ user.dienThoai || 'Không có thông tin' }}</td>
                                <td>{{ user.diaChi || 'Không có thông tin' }}</td>
                                <td>{{ user.phai || 'Không có thông tin' }}</td>
                                <td>{{ formatDate(user.ngaySinh) }}</td>
                                <td>{{ getActiveBorrowCount(user._id) }}</td>
                                <td>{{ getTotalBorrowCount(user._id) }}</td>
                                <td>
                                    <div class="btn-group">
                                        <button class="btn btn-sm btn-info" @click="viewUserDetails(user)">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="btn btn-sm btn-danger" @click="confirmDelete(user)">
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

        <div class="card mt-4">
            <div class="card-header bg-info text-white">
                <h4 class="mb-0">Thống kê người dùng</h4>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-4">
                        <div class="stat-card">
                            <div class="stat-value">{{ users.length }}</div>
                            <div class="stat-label">Tổng số đọc giả</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="stat-card">
                            <div class="stat-value">{{ activeUsers }}</div>
                            <div class="stat-label">Đọc giả đang mượn sách</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="stat-card">
                            <div class="stat-value">{{ totalBorrowCount }}</div>
                            <div class="stat-label">Tổng số lượt mượn sách</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal xem chi tiết đọc giả -->
        <div class="modal fade" id="userDetailModal" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content" v-if="selectedUser">
                    <div class="modal-header bg-info text-white">
                        <h5 class="modal-title">Chi tiết đọc giả</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="font-weight-bold">Họ lót:</label>
                                    <p>{{ selectedUser.hoLot }}</p>
                                </div>
                                <div class="form-group">
                                    <label class="font-weight-bold">Tên:</label>
                                    <p>{{ selectedUser.ten }}</p>
                                </div>
                                <div class="form-group">
                                    <label class="font-weight-bold">Email:</label>
                                    <p>{{ selectedUser.email }}</p>
                                </div>
                                <div class="form-group">
                                    <label class="font-weight-bold">Điện thoại:</label>
                                    <p>{{ selectedUser.dienThoai || 'Không có thông tin' }}</p>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label class="font-weight-bold">Giới tính:</label>
                                    <p>{{ selectedUser.phai || 'Không có thông tin' }}</p>
                                </div>
                                <div class="form-group">
                                    <label class="font-weight-bold">Ngày sinh:</label>
                                    <p>{{ formatDate(selectedUser.ngaySinh) }}</p>
                                </div>
                                <div class="form-group">
                                    <label class="font-weight-bold">Địa chỉ:</label>
                                    <p>{{ selectedUser.diaChi || 'Không có thông tin' }}</p>
                                </div>
                                <div class="form-group">
                                    <label class="font-weight-bold">Ngày đăng ký:</label>
                                    <p>{{ selectedUser.createdAt ? formatDate(selectedUser.createdAt) : 'Không có thông tin' }}</p>
                                </div>
                            </div>
                        </div>

                        <div v-if="userBorrows.length > 0">
                            <h5 class="mt-4 mb-3">Lịch sử mượn sách</h5>
                            <table class="table table-bordered table-sm">
                                <thead class="thead-light">
                                    <tr>
                                        <th>Tên sách</th>
                                        <th>Ngày mượn</th>
                                        <th>Ngày trả</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="borrow in userBorrows" :key="borrow._id">
                                        <td>{{ borrow.sach ? borrow.sach.tenSach : 'Không có thông tin' }}</td>
                                        <td>{{ formatDate(borrow.ngayMuon) }}</td>
                                        <td>{{ borrow.ngayTra ? formatDate(borrow.ngayTra) : 'Chưa trả' }}</td>
                                        <td>
                                            <span class="badge" :class="{
                                                'badge-warning': borrow.trangThai === 'pending',
                                                'badge-success': borrow.trangThai === 'approved',
                                                'badge-danger': borrow.trangThai === 'rejected',
                                                'badge-info': borrow.trangThai === 'returned'
                                            }">
                                                {{ getStatusText(borrow.trangThai) }}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div v-else class="alert alert-info mt-3">
                            <i class="fas fa-info-circle mr-2"></i> Đọc giả này chưa mượn sách nào.
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Đóng</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal xác nhận xóa -->
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
                    <div class="modal-body" v-if="userToDelete">
                        <p>Bạn có chắc chắn muốn xóa đọc giả <strong>{{ userToDelete.hoLot }} {{ userToDelete.ten
                                }}</strong>?</p>
                        <p class="text-danger"><strong>Lưu ý:</strong> Thao tác này sẽ xóa tất cả thông tin và lịch sử
                            mượn sách của đọc giả này!</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Hủy</button>
                        <button type="button" class="btn btn-danger" @click="deleteUser">Xóa</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AuthService from "@/services/auth.service";
import DocGiaService from "@/services/docgia.service";
import TheoDoiMuonSachService from "@/services/theodoimuonsach.service";
import $ from 'jquery';

export default {
    name: "AdminUsers",
    data() {
        return {
            users: [],
            borrowRecords: [],
            loading: true,
            searchText: "",
            selectedUser: null,
            userBorrows: [],
            userToDelete: null,
            error: null
        };
    },
    computed: {
        filteredUsers() {
            if (!this.searchText) return this.users;

            const searchLower = this.searchText.toLowerCase();
            return this.users.filter(user =>
                (user.hoLot && user.hoLot.toLowerCase().includes(searchLower)) ||
                (user.ten && user.ten.toLowerCase().includes(searchLower)) ||
                (user.email && user.email.toLowerCase().includes(searchLower)) ||
                (user.dienThoai && user.dienThoai.includes(searchLower)) ||
                (user.diaChi && user.diaChi.toLowerCase().includes(searchLower))
            );
        },
        activeUsers() {
            // Số lượng đọc giả đang mượn sách
            const activeUserIds = new Set();
            this.borrowRecords.forEach(record => {
                if (record.trangThai === 'approved' && !record.ngayTra && record.maDocGia) {
                    activeUserIds.add(record.maDocGia.toString());
                }
            });
            return activeUserIds.size;
        },
        totalBorrowCount() {
            // Tổng số lần mượn sách đã duyệt và đã trả
            return this.borrowRecords.filter(record =>
                record.trangThai === 'approved' || record.trangThai === 'returned'
            ).length;
        }
    },
    methods: {
        formatDate(dateString) {
            if (!dateString) return "Không có thông tin";
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(date);
        },
        getStatusText(status) {
            switch (status) {
                case 'pending': return 'Đang chờ duyệt';
                case 'approved': return 'Đã duyệt';
                case 'rejected': return 'Từ chối';
                case 'returned': return 'Đã trả';
                default: return 'Không xác định';
            }
        },
        getActiveBorrowCount(userId) {
            return this.borrowRecords.filter(record =>
                record.maDocGia === userId &&
                record.trangThai === 'approved' &&
                !record.ngayTra
            ).length;
        },
        getTotalBorrowCount(userId) {
            return this.borrowRecords.filter(record =>
                record.maDocGia === userId &&
                (record.trangThai === 'approved' || record.trangThai === 'returned')
            ).length;
        },
        async loadData() {
            this.loading = true;
            this.error = null;
            try {
                // Lấy tất cả đọc giả từ collection docgia
                this.users = await DocGiaService.getAll();
                console.log("Loaded users:", this.users);

                // Lấy tất cả bản ghi mượn sách
                this.borrowRecords = await TheoDoiMuonSachService.getAll();
                console.log("Loaded borrow records:", this.borrowRecords);

                // Sắp xếp danh sách đọc giả theo tên
                this.users.sort((a, b) => {
                    const nameA = `${a.hoLot} ${a.ten}`.toLowerCase();
                    const nameB = `${b.hoLot} ${b.ten}`.toLowerCase();
                    return nameA.localeCompare(nameB);
                });
            } catch (error) {
                console.error("Error loading user data:", error);
                this.error = "Có lỗi xảy ra khi tải dữ liệu: " + (error.message || "Lỗi không xác định");
            } finally {
                this.loading = false;
            }
        },
        searchUsers() {
            // Đã được xử lý bởi computed property filteredUsers
        },
        async viewUserDetails(user) {
            this.selectedUser = user;

            // Lọc các bản ghi mượn sách của đọc giả
            this.userBorrows = this.borrowRecords.filter(record =>
                record.maDocGia === user._id
            );

            // Hiển thị modal
            $('#userDetailModal').modal('show');
        },
        confirmDelete(user) {
            this.userToDelete = user;
            $('#deleteModal').modal('show');
        },
        async deleteUser() {
            if (!this.userToDelete) return;

            try {
                await DocGiaService.delete(this.userToDelete._id);

                // Đóng modal
                $('#deleteModal').modal('hide');

                // Cập nhật danh sách
                this.loadData();

                // Thông báo thành công
                alert("Xóa đọc giả thành công!");
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Có lỗi xảy ra khi xóa đọc giả. Vui lòng thử lại sau.");
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

.stat-card {
    background-color: #f8f9fa;
    border-radius: 0.25rem;
    padding: 1.5rem;
    text-align: center;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    height: 100%;
}

.stat-value {
    font-size: 2.5rem;
    font-weight: bold;
    color: #17a2b8;
    margin-bottom: 0.5rem;
}

.stat-label {
    font-size: 1rem;
    color: #6c757d;
}

.btn-group .btn {
    margin-right: 0.25rem;
}

.btn-group .btn:last-child {
    margin-right: 0;
}
</style>