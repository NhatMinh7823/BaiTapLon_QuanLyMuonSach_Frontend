<template>
    <div class="borrow-request">
        <h1 class="page-title">Chi tiết yêu cầu mượn sách</h1>

        <div v-if="loading" class="text-center my-5">
            <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            <p class="mt-2">Đang tải thông tin...</p>
        </div>

        <div v-else-if="!borrowRecord" class="alert alert-danger">
            Không tìm thấy thông tin yêu cầu mượn sách. Vui lòng thử lại sau.
        </div>

        <div v-else class="row">
            <div class="col-md-8">
                <div class="card mb-4">
                    <div class="card-header bg-primary text-white">
                        <h4 class="mb-0">Thông tin sách mượn</h4>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-4">
                                <div class="book-cover">
                                    <img :src="bookCover"
                                        :alt="borrowRecord.sach ? borrowRecord.sach.tenSach : 'Book cover'"
                                        class="img-fluid">
                                </div>
                            </div>
                            <div class="col-md-8">
                                <h4>{{ borrowRecord.sach ? borrowRecord.sach.tenSach : 'Không có thông tin' }}</h4>
                                <div class="book-info">
                                    <div class="info-item">
                                        <span class="info-label">Tác giả:</span>
                                        <span class="info-value">{{ borrowRecord.sach ? borrowRecord.sach.nguonGocTacGia
                                            : 'Không có thông tin' }}</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="info-label">Nhà xuất bản:</span>
                                        <span class="info-value">{{ borrowRecord.sach && borrowRecord.sach.nhaXuatBan ?
                                            borrowRecord.sach.nhaXuatBan.tenNXB : 'Không có thông tin' }}</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="info-label">Năm xuất bản:</span>
                                        <span class="info-value">{{ borrowRecord.sach ? borrowRecord.sach.namXuatBan :
                                            'Không có thông tin' }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-header bg-info text-white">
                        <h4 class="mb-0">Thông tin mượn</h4>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="borrow-info">
                                    <div class="info-item">
                                        <span class="info-label">Ngày mượn:</span>
                                        <span class="info-value">{{ formatDate(borrowRecord.ngayMuon) }}</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="info-label">Hạn trả:</span>
                                        <span class="info-value">{{ formatDate(getReturnDeadline(borrowRecord.ngayMuon))
                                            }}</span>
                                    </div>
                                    <div class="info-item">
                                        <span class="info-label">Ngày trả:</span>
                                        <span class="info-value">{{ borrowRecord.ngayTra ?
                                            formatDate(borrowRecord.ngayTra) : 'Chưa trả' }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="borrow-info">
                                    <div class="info-item">
                                        <span class="info-label">Trạng thái:</span>
                                        <span class="badge" :class="{
                                            'badge-warning': borrowRecord.trangThai === 'pending',
                                            'badge-success': borrowRecord.trangThai === 'approved',
                                            'badge-danger': borrowRecord.trangThai === 'rejected',
                                            'badge-info': borrowRecord.trangThai === 'returned'
                                        }">
                                            {{ getStatusText(borrowRecord.trangThai) }}
                                        </span>
                                    </div>
                                    <div class="info-item" v-if="borrowRecord.nhanVien">
                                        <span class="info-label">Nhân viên duyệt:</span>
                                        <span class="info-value">{{ borrowRecord.nhanVien.hoTenNV }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer bg-white" v-if="canReturn">
                        <button class="btn btn-primary" @click="confirmReturn">
                            <i class="fas fa-undo-alt mr-1"></i> Báo đã trả sách
                        </button>
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                <div class="card">
                    <div class="card-header bg-secondary text-white">
                        <h4 class="mb-0">Thông tin người mượn</h4>
                    </div>
                    <div class="card-body">
                        <div class="user-info">
                            <div class="info-item">
                                <span class="info-label">Họ tên:</span>
                                <span class="info-value">{{ currentUser.hoLot }} {{ currentUser.ten }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Email:</span>
                                <span class="info-value">{{ currentUser.email }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Điện thoại:</span>
                                <span class="info-value">{{ currentUser.dienThoai }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-4">
                    <router-link to="/user/borrow-history" class="btn btn-secondary btn-block">
                        <i class="fas fa-arrow-left mr-1"></i> Quay lại lịch sử mượn
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AuthService from "@/services/auth.service";
import TheoDoiMuonSachService from "@/services/theodoimuonsach.service";

export default {
    name: "BorrowRequest",
    props: {
        id: { type: String, required: true }
    },
    data() {
        return {
            borrowRecord: null,
            currentUser: null,
            loading: true
        };
    },
    computed: {
        bookCover() {
            return this.borrowRecord && this.borrowRecord.sach && this.borrowRecord.sach.anhBia
                ? this.borrowRecord.sach.anhBia
                : '/img/default-book-cover.jpg';
        },
        canReturn() {
            return this.borrowRecord &&
                this.borrowRecord.trangThai === 'approved' &&
                !this.borrowRecord.ngayTra;
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
        getReturnDeadline(borrowDate) {
            if (!borrowDate) return null;
            // Default borrow period is 14 days
            const date = new Date(borrowDate);
            date.setDate(date.getDate() + 14);
            return date;
        },
        async loadBorrowRecord() {
            try {
                this.borrowRecord = await TheoDoiMuonSachService.get(this.id);
            } catch (error) {
                console.error("Error loading borrow record:", error);
            } finally {
                this.loading = false;
            }
        },
        async confirmReturn() {
            if (confirm("Bạn có chắc chắn muốn báo đã trả sách này?")) {
                try {
                    await TheoDoiMuonSachService.markAsReturned(this.id);
                    // Reload the borrow record
                    this.loadBorrowRecord();
                    alert("Đã báo trả sách thành công!");
                } catch (error) {
                    console.error("Error marking book as returned:", error);
                    alert("Có lỗi xảy ra khi báo trả sách. Vui lòng thử lại sau.");
                }
            }
        }
    },
    created() {
        this.currentUser = AuthService.getCurrentUser();
        if (!this.currentUser) {
            this.$router.push("/login");
            return;
        }
        this.loadBorrowRecord();
    }
};
</script>

<style scoped>
.book-cover {
    max-width: 100%;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8f9fa;
    border-radius: 5px;
    overflow: hidden;
}

.book-cover img {
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
}

.info-item {
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.info-label {
    font-weight: bold;
    display: inline-block;
    width: 120px;
}

.info-value {
    font-size: 1.1em;
}
</style>