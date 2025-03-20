<template>
    <div class="borrow-history">
        <h1 class="page-title">Lịch sử mượn sách</h1>

        <div v-if="loading" class="text-center my-5">
            <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            <p class="mt-2">Đang tải lịch sử mượn sách...</p>
        </div>

        <div v-else>
            <div class="card mb-4">
                <div class="card-header bg-primary text-white">
                    <div class="d-flex justify-content-between align-items-center">
                        <h4 class="mb-0">Danh sách các lần mượn sách</h4>
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
                    <div v-if="filteredBorrows.length === 0" class="alert alert-info">
                        Không tìm thấy kết quả nào.
                    </div>
                    <div v-else class="table-responsive">
                        <table class="table table-bordered table-hover">
                            <thead class="thead-light">
                                <tr>
                                    <th>Tên sách</th>
                                    <th>Ngày mượn</th>
                                    <th>Ngày trả</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="borrow in filteredBorrows" :key="borrow._id">
                                    <td>{{ borrow.sach ? borrow.sach.tenSach : 'Không có thông tin' }}</td>
                                    <td>{{ formatDate(borrow.ngayMuon) }}</td>
                                    <td>{{ borrow.ngayTra ? formatDate(borrow.ngayTra) : 'Chưa trả' }}</td>
                                    <td>
                                        <span class="badge" :class="{
                                            'badge-warning': borrow.trangThai === 'pending',
                                            'badge-success': borrow.trangThai === 'approved' && !borrow.ngayTra,
                                            'badge-danger': borrow.trangThai === 'rejected',
                                            'badge-info': borrow.trangThai === 'returned' || (borrow.trangThai === 'approved' && borrow.ngayTra)
                                        }">
                                            {{ getStatusText(borrow.trangThai, borrow.ngayTra) }}
                                        </span>
                                    </td>
                                    <td>
                                        <button v-if="borrow.trangThai === 'approved' && !borrow.ngayTra"
                                            class="btn btn-sm btn-info" @click="viewDetails(borrow)">
                                            <i class="fas fa-info-circle"></i> Chi tiết
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header bg-info text-white">
                    <h4 class="mb-0">Thống kê</h4>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-3">
                            <div class="stat-card">
                                <div class="stat-icon bg-primary">
                                    <i class="fas fa-book"></i>
                                </div>
                                <div class="stat-details">
                                    <div class="stat-number">{{ borrowRecords.length }}</div>
                                    <div class="stat-title">Tổng số lần mượn</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="stat-card">
                                <div class="stat-icon bg-warning">
                                    <i class="fas fa-clock"></i>
                                </div>
                                <div class="stat-details">
                                    <div class="stat-number">{{ pendingCount }}</div>
                                    <div class="stat-title">Đang chờ duyệt</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="stat-card">
                                <div class="stat-icon bg-success">
                                    <i class="fas fa-check"></i>
                                </div>
                                <div class="stat-details">
                                    <div class="stat-number">{{ currentlyBorrowingCount }}</div>
                                    <div class="stat-title">Đang mượn</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="stat-card">
                                <div class="stat-icon bg-info">
                                    <i class="fas fa-undo-alt"></i>
                                </div>
                                <div class="stat-details">
                                    <div class="stat-number">{{ returnedCount }}</div>
                                    <div class="stat-title">Đã trả</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="row mt-4">
                        <div class="col-md-6">
                            <div class="stat-card">
                                <div class="stat-icon bg-danger">
                                    <i class="fas fa-times"></i>
                                </div>
                                <div class="stat-details">
                                    <div class="stat-number">{{ rejectedCount }}</div>
                                    <div class="stat-title">Bị từ chối</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="stat-card">
                                <div class="stat-icon" style="background-color: #6f42c1;">
                                    <i class="fas fa-check-double"></i>
                                </div>
                                <div class="stat-details">
                                    <div class="stat-number">{{ completedCount }}</div>
                                    <div class="stat-title">Đã hoàn thành</div>
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
import TheoDoiMuonSachService from "@/services/theodoimuonsach.service";

export default {
    name: "BorrowHistory",
    data() {
        return {
            currentUser: null,
            borrowRecords: [],
            loading: true,
            searchText: ""
        };
    },
    computed: {
        filteredBorrows() {
            if (!this.searchText) return this.borrowRecords;
            const searchLower = this.searchText.toLowerCase();
            return this.borrowRecords.filter(borrow =>
                (borrow.sach && borrow.sach.tenSach && borrow.sach.tenSach.toLowerCase().includes(searchLower)) ||
                this.getStatusText(borrow.trangThai, borrow.ngayTra).toLowerCase().includes(searchLower)
            );
        },
        pendingCount() {
            return this.borrowRecords.filter(borrow => borrow.trangThai === 'pending').length;
        },
        currentlyBorrowingCount() {
            return this.borrowRecords.filter(borrow =>
                borrow.trangThai === 'approved' && !borrow.ngayTra
            ).length;
        },
        returnedCount() {
            return this.borrowRecords.filter(borrow =>
                borrow.trangThai === 'returned' || (borrow.trangThai === 'approved' && borrow.ngayTra)
            ).length;
        },
        rejectedCount() {
            return this.borrowRecords.filter(borrow => borrow.trangThai === 'rejected').length;
        },
        completedCount() {
            return this.approvedCount + this.returnedCount;
        },
        approvedCount() {
            return this.borrowRecords.filter(borrow => borrow.trangThai === 'approved').length;
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
        getStatusText(status, returnDate) {
            if (status === 'approved' && returnDate) {
                return 'Đã trả';
            }

            switch (status) {
                case 'pending': return 'Đang chờ duyệt';
                case 'approved': return 'Đang mượn';
                case 'rejected': return 'Từ chối';
                case 'returned': return 'Đã trả';
                default: return 'Không xác định';
            }
        },
        viewDetails(borrow) {
            this.$router.push({ name: 'borrow-request', params: { id: borrow._id } });
        },
        async loadBorrowRecords() {
            try {
                if (this.currentUser && this.currentUser._id) {
                    this.borrowRecords = await TheoDoiMuonSachService.getMyRequests(this.currentUser._id);
                    // Sort by date (newest first)
                    this.borrowRecords.sort((a, b) => new Date(b.ngayMuon) - new Date(a.ngayMuon));
                }
            } catch (error) {
                console.error("Error loading borrow records:", error);
            } finally {
                this.loading = false;
            }
        },
        // Method to refresh data, useful when returning to this page after an action
        refreshData() {
            this.loading = true;
            this.loadBorrowRecords();
        }
    },
    created() {
        this.currentUser = AuthService.getCurrentUser();
        if (!this.currentUser) {
            this.$router.push("/login");
            return;
        }
        this.loadBorrowRecords();
    },
    // Add this to refresh data when navigating back to this page
    beforeRouteEnter(to, from, next) {
        next(vm => {
            // Check if we're coming back from a detail page
            if (from.name === 'borrow-request') {
                vm.refreshData();
            }
        });
    }
};
</script>

<style scoped>
.stat-card {
    display: flex;
    align-items: center;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    height: 100%;
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