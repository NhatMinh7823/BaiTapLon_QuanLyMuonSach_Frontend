<template>
    <div class="user-dashboard">
        <h1 class="page-title">Trang cá nhân</h1>

        <div v-if="loading" class="text-center my-5">
            <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            <p class="mt-2">Đang tải thông tin...</p>
        </div>

        <div v-else class="row">
            <div class="col-md-4">
                <div class="card mb-4">
                    <div class="card-header bg-primary text-white">
                        <h4 class="mb-0">Thông tin cá nhân</h4>
                    </div>
                    <div class="card-body">
                        <div class="profile-item">
                            <span class="profile-label">Họ tên:</span>
                            <span class="profile-value">{{ currentUser.hoLot }} {{ currentUser.ten }}</span>
                        </div>
                        <div class="profile-item">
                            <span class="profile-label">Email:</span>
                            <span class="profile-value">{{ currentUser.email }}</span>
                        </div>
                        <div class="profile-item">
                            <span class="profile-label">Ngày sinh:</span>
                            <span class="profile-value">{{ formatDate(currentUser.ngaySinh) }}</span>
                        </div>
                        <div class="profile-item">
                            <span class="profile-label">Giới tính:</span>
                            <span class="profile-value">{{ currentUser.phai }}</span>
                        </div>
                        <div class="profile-item">
                            <span class="profile-label">Địa chỉ:</span>
                            <span class="profile-value">{{ currentUser.diaChi }}</span>
                        </div>
                        <div class="profile-item">
                            <span class="profile-label">Điện thoại:</span>
                            <span class="profile-value">{{ currentUser.dienThoai }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-8">
                <div class="card mb-4">
                    <div class="card-header bg-success text-white">
                        <h4 class="mb-0">Thống kê mượn sách</h4>
                    </div>
                    <div class="card-body">
                        <div class="row stats">
                            <div class="col-md-4">
                                <div class="stat-card">
                                    <div class="stat-icon bg-warning">
                                        <i class="fas fa-clock"></i>
                                    </div>
                                    <div class="stat-details">
                                        <div class="stat-number">{{ pendingRequests }}</div>
                                        <div class="stat-title">Đang chờ duyệt</div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="stat-card">
                                    <div class="stat-icon bg-success">
                                        <i class="fas fa-book-reader"></i>
                                    </div>
                                    <div class="stat-details">
                                        <div class="stat-number">{{ currentlyBorrowing }}</div>
                                        <div class="stat-title">Đang mượn</div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="stat-card">
                                    <div class="stat-icon bg-info">
                                        <i class="fas fa-history"></i>
                                    </div>
                                    <div class="stat-details">
                                        <div class="stat-number">{{ totalBorrowed }}</div>
                                        <div class="stat-title">Tổng đã mượn</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="mt-4">
                            <h5>Đang chờ duyệt</h5>
                            <div v-if="pendingBorrows.length === 0" class="alert alert-info">
                                Bạn không có yêu cầu mượn sách nào đang chờ duyệt.
                            </div>
                            <div v-else class="table-responsive">
                                <table class="table table-bordered table-hover">
                                    <thead class="thead-light">
                                        <tr>
                                            <th>Tên sách</th>
                                            <th>Ngày đăng ký</th>
                                            <th>Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="borrow in pendingBorrows" :key="borrow._id">
                                            <td>{{ borrow.sach ? borrow.sach.tenSach : 'Không có thông tin' }}</td>
                                            <td>{{ formatDate(borrow.ngayMuon) }}</td>
                                            <td><span class="badge badge-warning">Đang chờ duyệt</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="mt-4">
                            <h5>Đang mượn</h5>
                            <div v-if="activeBorrows.length === 0" class="alert alert-info">
                                Bạn không có sách nào đang mượn.
                            </div>
                            <div v-else class="table-responsive">
                                <table class="table table-bordered table-hover">
                                    <thead class="thead-light">
                                        <tr>
                                            <th>Tên sách</th>
                                            <th>Ngày mượn</th>
                                            <th>Hạn trả</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="borrow in activeBorrows" :key="borrow._id">
                                            <td>{{ borrow.sach ? borrow.sach.tenSach : 'Không có thông tin' }}</td>
                                            <td>{{ formatDate(borrow.ngayMuon) }}</td>
                                            <td>{{ formatDate(getReturnDeadline(borrow.ngayMuon)) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="mt-4 text-center">
                            <router-link to="/user/borrow-history" class="btn btn-primary">
                                <i class="fas fa-history mr-1"></i> Xem lịch sử mượn sách
                            </router-link>
                            <router-link to="/books" class="btn btn-success ml-2">
                                <i class="fas fa-book mr-1"></i> Mượn sách mới
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AuthService from "@/services/auth.service";
import TheoDoiMuonSachService from "@/services/theodoimuonsach.service";

export default {
    name: "UserDashboard",
    data() {
        return {
            currentUser: null,
            borrowRecords: [],
            loading: true
        };
    },
    computed: {
        pendingBorrows() {
            return this.borrowRecords.filter(borrow => borrow.trangThai === 'pending');
        },
        activeBorrows() {
            return this.borrowRecords.filter(borrow => borrow.trangThai === 'approved' && !borrow.ngayTra);
        },
        pendingRequests() {
            return this.pendingBorrows.length;
        },
        currentlyBorrowing() {
            return this.activeBorrows.length;
        },
        totalBorrowed() {
            return this.borrowRecords.filter(borrow =>
                borrow.trangThai === 'approved' || borrow.trangThai === 'returned'
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
        getReturnDeadline(borrowDate) {
            if (!borrowDate) return null;
            // Default borrow period is 14 days
            const date = new Date(borrowDate);
            date.setDate(date.getDate() + 14);
            return date;
        },
        async loadBorrowRecords() {
            try {
                if (this.currentUser && this.currentUser._id) {
                    this.borrowRecords = await TheoDoiMuonSachService.getMyRequests(this.currentUser._id);
                }
            } catch (error) {
                console.error("Error loading borrow records:", error);
            } finally {
                this.loading = false;
            }
        }
    },
    created() {
        this.currentUser = AuthService.getCurrentUser();
        if (!this.currentUser) {
            this.$router.push("/login");
            return;
        }
        this.loadBorrowRecords();
    }
};
</script>

<style scoped>
.profile-item {
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.profile-label {
    font-weight: bold;
    display: inline-block;
    width: 100px;
}

.profile-value {
    font-size: 1.1em;
}

.stats {
    margin-bottom: 20px;
}

.stat-card {
    display: flex;
    align-items: center;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    color: white;
    font-size: 1.5rem;
}

.stat-details {
    flex: 1;
}

.stat-number {
    font-size: 1.5rem;
    font-weight: bold;
}

.stat-title {
    font-size: 0.9rem;
    color: #6c757d;
}
</style>