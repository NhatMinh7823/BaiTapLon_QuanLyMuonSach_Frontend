<template>
    <div class="admin-dashboard">
        <h1 class="page-title">Bảng điều khiển quản trị</h1>

        <div v-if="loading" class="text-center my-5">
            <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            <p class="mt-2">Đang tải dữ liệu...</p>
        </div>

        <div v-else class="dashboard-stats">
            <div class="row">
                <div class="col-md-3">
                    <div class="stat-card">
                        <div class="stat-icon bg-primary">
                            <i class="fas fa-book"></i>
                        </div>
                        <div class="stat-details">
                            <div class="stat-number">{{ totalBooks }}</div>
                            <div class="stat-title">Tổng số sách</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-card">
                        <div class="stat-icon bg-success">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-details">
                            <div class="stat-number">{{ totalUsers }}</div>
                            <div class="stat-title">Tổng số độc giả</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-card">
                        <div class="stat-icon bg-warning">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="stat-details">
                            <div class="stat-number">{{ pendingRequests }}</div>
                            <div class="stat-title">Yêu cầu chờ duyệt</div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stat-card">
                        <div class="stat-icon bg-info">
                            <i class="fas fa-book-reader"></i>
                        </div>
                        <div class="stat-details">
                            <div class="stat-number">{{ activeBorrows }}</div>
                            <div class="stat-title">Đang mượn</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mt-4">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header bg-warning text-white">
                        <h4 class="mb-0">Yêu cầu mượn sách mới</h4>
                    </div>
                    <div class="card-body">
                        <div v-if="pendingBorrows.length === 0" class="alert alert-info">
                            Không có yêu cầu mượn sách mới nào.
                        </div>
                        <div v-else class="table-responsive">
                            <table class="table table-bordered table-hover">
                                <thead class="thead-light">
                                    <tr>
                                        <th>Tên sách</th>
                                        <th>Người mượn</th>
                                        <th>Ngày đăng ký</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="borrow in pendingBorrows.slice(0, 5)" :key="borrow._id">
                                        <td>{{ borrow.sach ? borrow.sach.tenSach : 'Không có thông tin' }}</td>
                                        <td>{{ borrow.docGia ? `${borrow.docGia.hoLot} ${borrow.docGia.ten}` : 'Không có thông tin' }}</td>
                                        <td>{{ formatDate(borrow.ngayMuon) }}</td>
                                        <td>
                                            <div class="btn-group">
                                                <button class="btn btn-sm btn-success"
                                                    @click="approveRequest(borrow._id)">
                                                    <i class="fas fa-check"></i>
                                                </button>
                                                <button class="btn btn-sm btn-danger"
                                                    @click="rejectRequest(borrow._id)">
                                                    <i class="fas fa-times"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="text-center mt-3" v-if="pendingBorrows.length > 5">
                                <router-link to="/admin/borrow-requests" class="btn btn-primary">
                                    Xem tất cả yêu cầu
                                </router-link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-6">
                <div class="card">
                    <div class="card-header bg-info text-white">
                        <h4 class="mb-0">Sách đang được mượn nhiều</h4>
                    </div>
                    <div class="card-body">
                        <div v-if="topBooks.length === 0" class="alert alert-info">
                            Không có dữ liệu thống kê.
                        </div>
                        <div v-else class="table-responsive">
                            <table class="table table-bordered table-hover">
                                <thead class="thead-light">
                                    <tr>
                                        <th>Tên sách</th>
                                        <th>Tác giả</th>
                                        <th>Số lượt mượn</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="book in topBooks" :key="book._id">
                                        <td>{{ book.tenSach }}</td>
                                        <td>{{ book.nguonGocTacGia }}</td>
                                        <td>{{ book.borrowCount }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mt-4">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header bg-primary text-white">
                        <h4 class="mb-0">Quản lý hệ thống</h4>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-3">
                                <div class="admin-card">
                                    <div class="admin-card-icon bg-primary">
                                        <i class="fas fa-book"></i>
                                    </div>
                                    <div class="admin-card-content">
                                        <h5>Quản lý sách</h5>
                                        <p>Thêm, sửa, xóa sách</p>
                                        <router-link to="/admin/books" class="btn btn-primary btn-sm">
                                            Quản lý
                                        </router-link>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="admin-card">
                                    <div class="admin-card-icon bg-success">
                                        <i class="fas fa-building"></i>
                                    </div>
                                    <div class="admin-card-content">
                                        <h5>Nhà xuất bản</h5>
                                        <p>Quản lý nhà xuất bản</p>
                                        <router-link to="/admin/publishers" class="btn btn-success btn-sm">
                                            Quản lý
                                        </router-link>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="admin-card">
                                    <div class="admin-card-icon bg-warning">
                                        <i class="fas fa-clipboard-list"></i>
                                    </div>
                                    <div class="admin-card-content">
                                        <h5>Mượn sách</h5>
                                        <p>Xét duyệt yêu cầu mượn sách</p>
                                        <router-link to="/admin/borrow-requests"
                                            class="btn btn-warning btn-sm text-white">
                                            Quản lý
                                        </router-link>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="admin-card">
                                    <div class="admin-card-icon bg-info">
                                        <i class="fas fa-users"></i>
                                    </div>
                                    <div class="admin-card-content">
                                        <h5>Độc giả</h5>
                                        <p>Quản lý thông tin độc giả</p>
                                        <router-link to="/admin/users" class="btn btn-info btn-sm">
                                            Quản lý
                                        </router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AuthService from "@/services/auth.service";
import SachService from "@/services/sach.service";
import TheoDoiMuonSachService from "@/services/theodoimuonsach.service";

export default {
    name: "AdminDashboard",
    data() {
        return {
            books: [],
            borrowRecords: [],
            users: [],
            loading: true,
            topBooks: [],
            currentUser: null
        };
    },
    computed: {
        totalBooks() {
            return this.books.length;
        },
        totalUsers() {
            return this.users.length;
        },
        pendingBorrows() {
            return this.borrowRecords.filter(borrow => borrow.trangThai === 'pending');
        },
        pendingRequests() {
            return this.pendingBorrows.length;
        },
        activeBorrows() {
            return this.borrowRecords.filter(borrow =>
                borrow.trangThai === 'approved' && !borrow.ngayTra
            ).length;
        }
    },
    methods: {
        formatDate(dateString) {
            if (!dateString) return "N/A";
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(date);
        },
        async loadData() {
            try {
                // Load books
                this.books = await SachService.getAll();

                // Load borrow records
                this.borrowRecords = await TheoDoiMuonSachService.getAll();

                // Extract unique users from borrow records
                const userIds = new Set();
                this.borrowRecords.forEach(record => {
                    if (record.docGia && record.docGia._id) {
                        userIds.add(record.docGia._id);
                    }
                });
                this.users = Array.from(userIds).length;

                // Calculate top borrowed books
                const bookBorrowCounts = {};
                this.borrowRecords.forEach(record => {
                    if (record.sach && record.sach._id) {
                        const bookId = record.sach._id;
                        if (!bookBorrowCounts[bookId]) {
                            bookBorrowCounts[bookId] = {
                                _id: bookId,
                                tenSach: record.sach.tenSach,
                                nguonGocTacGia: record.sach.nguonGocTacGia,
                                borrowCount: 0
                            };
                        }
                        bookBorrowCounts[bookId].borrowCount++;
                    }
                });

                this.topBooks = Object.values(bookBorrowCounts)
                    .sort((a, b) => b.borrowCount - a.borrowCount)
                    .slice(0, 5);
            } catch (error) {
                console.error("Error loading dashboard data:", error);
            } finally {
                this.loading = false;
            }
        },
        async approveRequest(id) {
            try {
                await TheoDoiMuonSachService.approve(id, this.currentUser._id);
                // Reload data after approval
                this.loadData();
            } catch (error) {
                console.error("Error approving request:", error);
                alert("Có lỗi xảy ra khi duyệt yêu cầu. Vui lòng thử lại sau.");
            }
        },
        async rejectRequest(id) {
            try {
                await TheoDoiMuonSachService.reject(id, this.currentUser._id);
                // Reload data after rejection
                this.loadData();
            } catch (error) {
                console.error("Error rejecting request:", error);
                alert("Có lỗi xảy ra khi từ chối yêu cầu. Vui lòng thử lại sau.");
            }
        }
    },
    created() {
        this.currentUser = AuthService.getCurrentUser();
        if (!this.currentUser || !AuthService.isAdmin()) {
            this.$router.push("/login");
            return;
        }
        this.loadData();
    }
};
</script>

<style scoped>
.dashboard-stats {
    margin-bottom: 30px;
}

.stat-card {
    display: flex;
    align-items: center;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    height: 100%;
}

.stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    color: white;
    font-size: 1.8rem;
}

.stat-details {
    flex: 1;
}

.stat-number {
    font-size: 2rem;
    font-weight: bold;
}

.stat-title {
    font-size: 1rem;
    color: #6c757d;
}

.admin-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    height: 100%;
}

.admin-card-icon {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;
    color: white;
    font-size: 2rem;
}

.admin-card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.admin-card-content p {
    margin-bottom: 15px;
}

.admin-card-content .btn {
    margin-top: auto;
}
</style>