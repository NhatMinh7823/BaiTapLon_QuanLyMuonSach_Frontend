<template>
    <div class="admin-borrow-requests">
        <h1 class="page-title">Quản lý yêu cầu mượn sách</h1>

        <div class="card">
            <div class="card-header bg-primary text-white">
                <div class="d-flex justify-content-between align-items-center flex-wrap">
                    <h4 class="mb-0">Danh sách yêu cầu mượn sách</h4>

                    <div class="filters mt-2 mt-md-0">
                        <div class="btn-group">
                            <button class="btn" :class="activeTab === 'all' ? 'btn-light' : 'btn-outline-light'"
                                @click="activeTab = 'all'">
                                Tất cả
                            </button>
                            <button class="btn" :class="activeTab === 'pending' ? 'btn-light' : 'btn-outline-light'"
                                @click="activeTab = 'pending'">
                                Chờ duyệt
                            </button>
                            <button class="btn" :class="activeTab === 'approved' ? 'btn-light' : 'btn-outline-light'"
                                @click="activeTab = 'approved'">
                                Đã duyệt
                            </button>
                            <button class="btn" :class="activeTab === 'returned' ? 'btn-light' : 'btn-outline-light'"
                                @click="activeTab = 'returned'">
                                Đã trả
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <div class="input-group">
                        <input type="text" class="form-control" placeholder="Tìm kiếm theo tên sách hoặc tên độc giả..."
                            v-model="searchText">
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary" type="button">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div v-if="loading" class="text-center my-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                    <p class="mt-2">Đang tải danh sách yêu cầu mượn sách...</p>
                </div>

                <div v-else-if="error" class="alert alert-danger">
                    {{ error }}
                </div>

                <div v-else-if="filteredBorrows.length === 0" class="alert alert-info">
                    Không tìm thấy yêu cầu mượn sách nào.
                </div>

                <div v-else class="table-responsive">
                    <table class="table table-bordered table-hover">
                        <thead class="thead-light">
                            <tr>
                                <th>Tên sách</th>
                                <th>Người mượn</th>
                                <th>Ngày mượn</th>
                                <th>Ngày trả</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="borrow in filteredBorrows" :key="borrow._id">
                                <td>{{ borrow.sach ? borrow.sach.tenSach : 'Không có thông tin' }}</td>
                                <td>{{ borrow.docGia ? `${borrow.docGia.hoLot} ${borrow.docGia.ten}` : 'Không có thông tin' }}</td>
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
                                <td>
                                    <div class="btn-group" v-if="borrow.trangThai === 'pending'">
                                        <button class="btn btn-sm btn-success" @click="approveBorrow(borrow)">
                                            <i class="fas fa-check"></i>
                                        </button>
                                        <button class="btn btn-sm btn-danger" @click="rejectBorrow(borrow)">
                                            <i class="fas fa-times"></i>
                                        </button>
                                    </div>
                                    <div v-else-if="borrow.trangThai === 'approved' && !borrow.ngayTra">
                                        <button class="btn btn-sm btn-info" @click="markAsReturned(borrow)">
                                            <i class="fas fa-undo-alt"></i> Đánh dấu đã trả
                                        </button>
                                    </div>
                                    <div v-else>
                                        <span class="text-muted">Không có thao tác</span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AuthService from "@/services/auth.service";
import TheoDoiMuonSachService from "@/services/theodoimuonsach.service";

export default {
    name: "AdminBorrowRequests",
    data() {
        return {
            borrowRecords: [],
            loading: true,
            searchText: "",
            activeTab: "pending",
            currentUser: null,
            error: null
        };
    },
    computed: {
        filteredBorrows() {
            // First filter by active tab
            let filtered = this.borrowRecords;

            if (this.activeTab !== "all") {
                filtered = filtered.filter(borrow => {
                    if (this.activeTab === "pending") return borrow.trangThai === "pending";
                    if (this.activeTab === "approved") return borrow.trangThai === "approved" && !borrow.ngayTra;
                    if (this.activeTab === "returned") return borrow.trangThai === "returned" || (borrow.trangThai === "approved" && borrow.ngayTra);
                    return true;
                });
            }

            // Then filter by search text
            if (this.searchText) {
                const searchLower = this.searchText.toLowerCase();
                filtered = filtered.filter(borrow =>
                    (borrow.sach && borrow.sach.tenSach && borrow.sach.tenSach.toLowerCase().includes(searchLower)) ||
                    (borrow.docGia && borrow.docGia.hoLot && borrow.docGia.hoLot.toLowerCase().includes(searchLower)) ||
                    (borrow.docGia && borrow.docGia.ten && borrow.docGia.ten.toLowerCase().includes(searchLower))
                );
            }

            return filtered;
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
        getStatusText(status) {
            switch (status) {
                case 'pending': return 'Đang chờ duyệt';
                case 'approved': return 'Đã duyệt';
                case 'rejected': return 'Từ chối';
                case 'returned': return 'Đã trả';
                default: return 'Không xác định';
            }
        },
        async loadBorrowRecords() {
            this.loading = true;
            this.error = null;
            try {
                console.log("Loading borrow records...");
                this.borrowRecords = await TheoDoiMuonSachService.getAll();
                console.log("Loaded records:", this.borrowRecords);

                // Sort by date (newest first)
                this.borrowRecords.sort((a, b) => new Date(b.ngayMuon) - new Date(a.ngayMuon));
            } catch (error) {
                console.error("Error loading borrow records:", error);
                this.error = "Có lỗi xảy ra khi tải dữ liệu: " + (error.message || "Lỗi không xác định");
            } finally {
                this.loading = false;
            }
        },
        async approveBorrow(borrow) {
            try {
                await TheoDoiMuonSachService.approve(borrow._id, this.currentUser._id);
                // Tìm bản ghi mượn sách trong danh sách
                const index = this.borrowRecords.findIndex(record => record._id === borrow._id);
                if (index !== -1 && this.borrowRecords[index].sach) {
                    // Tải lại danh sách sách và bản ghi mượn để có dữ liệu mới nhất
                    this.loadBorrowRecords();
                } else {
                    // Hoặc chỉ tải lại một bản ghi cụ thể
                    this.loadBorrowRecords();
                }
            } catch (error) {
                console.error("Error approving request:", error);
                alert("Có lỗi xảy ra khi duyệt yêu cầu. Vui lòng thử lại sau.");
            }
        },
        async rejectBorrow(borrow) {
            try {
                console.log("Rejecting borrow:", borrow);
                await TheoDoiMuonSachService.reject(borrow._id, this.currentUser._id);
                // Reload data after rejection
                this.loadBorrowRecords();
            } catch (error) {
                console.error("Error rejecting request:", error);
                alert("Có lỗi xảy ra khi từ chối yêu cầu. Vui lòng thử lại sau.");
            }
        },
        async markAsReturned(borrow) {
            try {
                await TheoDoiMuonSachService.markAsReturned(borrow._id);
                // Tải lại dữ liệu để cập nhật UI
                this.loadBorrowRecords();
            } catch (error) {
                console.error("Error marking as returned:", error);
                alert("Có lỗi xảy ra khi đánh dấu đã trả sách. Vui lòng thử lại sau.");
            }
        }
    },
    created() {
        this.currentUser = AuthService.getCurrentUser();
        if (!this.currentUser || !AuthService.isAdmin()) {
            this.$router.push("/login");
            return;
        }
        this.loadBorrowRecords();
    }
};
</script>

<style scoped>
.filters {
    display: flex;
    flex-wrap: wrap;
}

.badge {
    font-size: 90%;
    padding: 0.4em 0.6em;
}

.table th,
.table td {
    vertical-align: middle;
}

.btn-group .btn {
    margin-right: 2px;
}

.btn-group .btn:last-child {
    margin-right: 0;
}

@media (max-width: 768px) {
    .d-flex {
        flex-direction: column;
    }

    .filters {
        margin-top: 1rem;
        width: 100%;
    }

    .btn-group {
        width: 100%;
        display: flex;
    }

    .btn-group .btn {
        flex: 1;
    }
}
</style>