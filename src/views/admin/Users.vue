<!-- src/views/admin/Users.vue -->
<template>
    <div class="admin-users">
        <h1 class="page-title">Quản lý độc giả</h1>

        <div class="card">
            <div class="card-header bg-primary text-white">
                <div class="d-flex justify-content-between align-items-center">
                    <h4 class="mb-0">Danh sách độc giả</h4>
                    <div class="form-inline">
                        <div class="input-group">
                            <input type="text" class="form-control" placeholder="Tìm kiếm..." v-model="searchText">
                            <div class="input-group-append">
                                <button class="btn btn-light" type="button">
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
                    <p class="mt-2">Đang tải danh sách độc giả...</p>
                </div>

                <div v-else-if="filteredUsers.length === 0" class="alert alert-info">
                    Không tìm thấy độc giả nào.
                </div>

                <div v-else class="table-responsive">
                    <table class="table table-bordered table-hover">
                        <thead class="thead-light">
                            <tr>
                                <th>Họ tên</th>
                                <th>Email</th>
                                <th>Điện thoại</th>
                                <th>Địa chỉ</th>
                                <th>Số sách đang mượn</th>
                                <th>Tổng số lần mượn</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="user in filteredUsers" :key="user._id">
                                <td>{{ user.hoLot }} {{ user.ten }}</td>
                                <td>{{ user.email }}</td>
                                <td>{{ user.dienThoai || 'Không có thông tin' }}</td>
                                <td>{{ user.diaChi || 'Không có thông tin' }}</td>
                                <td>{{ getActiveBorrowCount(user._id) }}</td>
                                <td>{{ getTotalBorrowCount(user._id) }}</td>
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
                            <div class="stat-label">Tổng số độc giả</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="stat-card">
                            <div class="stat-value">{{ activeUsers }}</div>
                            <div class="stat-label">Độc giả đang mượn sách</div>
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
    </div>
</template>

<script>
import AuthService from "@/services/auth.service";
import TheoDoiMuonSachService from "@/services/theodoimuonsach.service";

export default {
    name: "AdminUsers",
    data() {
        return {
            users: [],
            borrowRecords: [],
            loading: true,
            searchText: ""
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
            // Count users who are currently borrowing books
            const activeUserIds = new Set();

            this.borrowRecords.forEach(record => {
                if (record.trangThai === 'approved' && !record.ngayTra && record.maDocGia) {
                    activeUserIds.add(record.maDocGia.toString());
                }
            });

            return activeUserIds.size;
        },
        totalBorrowCount() {
            // Count total approved and returned borrow records
            return this.borrowRecords.filter(record =>
                record.trangThai === 'approved' || record.trangThai === 'returned'
            ).length;
        }
    },
    methods: {
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
            try {
                // Get all borrow records
                this.borrowRecords = await TheoDoiMuonSachService.getAll();

                // Extract unique users from borrow records
                const userMap = {};
                this.borrowRecords.forEach(record => {
                    if (record.docGia) {
                        userMap[record.docGia._id] = record.docGia;
                    }
                });

                this.users = Object.values(userMap);

                // Sort users by name
                this.users.sort((a, b) => {
                    const nameA = `${a.hoLot} ${a.ten}`.toLowerCase();
                    const nameB = `${b.hoLot} ${b.ten}`.toLowerCase();
                    return nameA.localeCompare(nameB);
                });
            } catch (error) {
                console.error("Error loading user data:", error);
            } finally {
                this.loading = false;
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
</style>