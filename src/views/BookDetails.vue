<template>
    <div class="book-details">
        <div v-if="loading" class="text-center my-5">
            <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            <p class="mt-2">Đang tải thông tin sách...</p>
        </div>

        <div v-else-if="!book" class="alert alert-danger">
            Không tìm thấy thông tin sách. Vui lòng thử lại sau.
        </div>

        <div v-else class="row">
            <div class="col-md-4">
                <div class="card mb-4">
                    <div class="card-img-container">
                        <img :src="book.anhBia || '/img/default-book-cover.jpg'" class="card-img-top"
                            :alt="book.tenSach">
                    </div>
                    <div class="card-body text-center" v-if="isLoggedIn && !isAdmin">
                        <button @click="borrowBook" class="btn btn-success btn-lg" :disabled="book.soQuyen <= 0">
                            <i class="fas fa-book-reader mr-1"></i> Đăng ký mượn sách
                        </button>
                        <p v-if="book.soQuyen <= 0" class="text-danger mt-2">Sách đã hết, không thể mượn</p>
                    </div>
                </div>
            </div>

            <div class="col-md-8">
                <h1 class="mb-3">{{ book.tenSach }}</h1>

                <div class="book-info">
                    <div class="info-item">
                        <span class="info-label">Tác giả:</span>
                        <span class="info-value">{{ book.nguonGocTacGia || 'Không có thông tin' }}</span>
                    </div>

                    <div class="info-item">
                        <span class="info-label">Nhà xuất bản:</span>
                        <span class="info-value">{{ book.nhaXuatBan ? book.nhaXuatBan.tenNXB : 'Không có thông tin'
                            }}</span>
                    </div>

                    <div class="info-item">
                        <span class="info-label">Năm xuất bản:</span>
                        <span class="info-value">{{ book.namXuatBan || 'Không có thông tin' }}</span>
                    </div>

                    <div class="info-item">
                        <span class="info-label">Đơn giá:</span>
                        <span class="info-value">{{ formatCurrency(book.donGia) }}</span>
                    </div>

                    <div class="info-item">
                        <span class="info-label">Số quyển còn lại:</span>
                        <span class="info-value"
                            :class="{ 'text-danger': book.soQuyen <= 0, 'text-success': book.soQuyen > 0 }">
                            {{ book.soQuyen || 0 }}
                        </span>
                    </div>
                </div>

                <div class="mt-4" v-if="!isLoggedIn">
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle mr-1"></i>
                        Vui lòng <router-link to="/login">đăng nhập</router-link> để đăng ký mượn sách.
                    </div>
                </div>

                <div v-if="message" class="alert" :class="successful ? 'alert-success' : 'alert-danger'">
                    {{ message }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SachService from "@/services/sach.service";
import TheoDoiMuonSachService from "@/services/theodoimuonsach.service";
import AuthService from "@/services/auth.service";

export default {
    name: "BookDetails",
    props: {
        id: { type: String, required: true }
    },
    data() {
        return {
            book: null,
            loading: false,
            message: "",
            successful: false
        };
    },
    computed: {
        isLoggedIn() {
            return AuthService.isAuthenticated();
        },
        isAdmin() {
            return AuthService.isAdmin();
        }
    },
    methods: {
        formatCurrency(value) {
            if (!value) return "0 VNĐ";
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
        },
        async loadBook() {
            this.loading = true;
            try {
                this.book = await SachService.get(this.id);
            } catch (error) {
                console.error("Error loading book:", error);
            } finally {
                this.loading = false;
            }
        },
        async borrowBook() {
            if (!this.isLoggedIn) {
                this.$router.push({ name: 'login', query: { redirect: this.$route.fullPath } });
                return;
            }

            try {
                const currentUser = AuthService.getCurrentUser();
                if (!currentUser || !currentUser._id) {
                    this.message = "Không thể xác định thông tin người dùng. Vui lòng đăng nhập lại.";
                    this.successful = false;
                    return;
                }

                await TheoDoiMuonSachService.create({
                    maDocGia: currentUser._id,
                    maSach: this.book._id,
                    ngayMuon: new Date(),
                    trangThai: "pending"
                });

                this.message = "Đã đăng ký mượn sách thành công! Vui lòng đợi phê duyệt từ thủ thư.";
                this.successful = true;
            } catch (error) {
                this.message = "Có lỗi xảy ra khi đăng ký mượn sách. Vui lòng thử lại sau.";
                this.successful = false;
                console.error("Error borrowing book:", error);
            }
        }
    },
    created() {
        this.loadBook();
    }
};
</script>

<style scoped>
.card-img-container {
    height: 350px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8f9fa;
    padding: 15px;
}

.card-img-container img {
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
}

.book-info {
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 5px;
    margin-bottom: 20px;
}

.info-item {
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
}

.info-label {
    font-weight: bold;
    margin-right: 10px;
    width: 120px;
    display: inline-block;
}

.info-value {
    font-size: 1.1em;
}

.card {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>