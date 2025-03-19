<template>
    <div class="book-list">
        <h1 class="page-title">Danh mục sách</h1>

        <div class="row mb-4">
            <div class="col-md-8">
                <div class="input-group">
                    <input type="text" class="form-control" placeholder="Tìm kiếm sách..." v-model="searchText"
                        @keyup.enter="searchBooks">
                    <div class="input-group-append">
                        <button class="btn btn-primary" @click="searchBooks">
                            <i class="fas fa-search"></i> Tìm kiếm
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="loading" class="text-center my-5">
            <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            <p class="mt-2">Đang tải danh sách sách...</p>
        </div>

        <div v-else-if="books.length === 0" class="alert alert-info">
            Không tìm thấy sách nào. Hãy thử tìm kiếm với từ khóa khác.
        </div>

        <div v-else class="row">
            <div class="col-md-4 mb-4" v-for="book in books" :key="book._id">
                <div class="card h-100">
                    <div class="card-img-container">
                        <img :src="book.anhBia || '/img/default-book-cover.jpg'" class="card-img-top"
                            :alt="book.tenSach">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">{{ book.tenSach }}</h5>
                        <p class="card-text">
                            <small class="text-muted">
                                <i class="fas fa-building mr-1"></i>
                                {{ book.nhaXuatBan ? book.nhaXuatBan.tenNXB : 'Không có thông tin NXB' }}
                            </small>
                        </p>
                        <p class="card-text">
                            <i class="fas fa-user mr-1"></i> {{ book.nguonGocTacGia || 'Không có thông tin tác giả' }}
                        </p>
                        <p class="card-text">
                            <i class="fas fa-calendar-alt mr-1"></i> Năm xuất bản: {{ book.namXuatBan || 'N/A' }}
                        </p>
                        <p class="card-text">
                            <i class="fas fa-money-bill-wave mr-1"></i> Đơn giá: {{ formatCurrency(book.donGia) }}
                        </p>
                        <p class="card-text">
                            <i class="fas fa-book mr-1"></i> Số quyển: {{ book.soQuyen || 0 }}
                        </p>
                    </div>
                    <div class="card-footer bg-white">
                        <router-link :to="{ name: 'book-details', params: { id: book._id } }"
                            class="btn btn-primary btn-block">
                            <i class="fas fa-info-circle mr-1"></i> Xem chi tiết
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SachService from "@/services/sach.service";

export default {
    name: "BookList",
    data() {
        return {
            books: [],
            loading: false,
            searchText: ""
        };
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
        async searchBooks() {
            this.loading = true;
            try {
                if (this.searchText.trim()) {
                    // If you have a backend search endpoint, use it
                    // For now, we'll just filter the books
                    const allBooks = await SachService.getAll();
                    this.books = allBooks.filter(book =>
                        book.tenSach.toLowerCase().includes(this.searchText.toLowerCase()) ||
                        (book.nguonGocTacGia && book.nguonGocTacGia.toLowerCase().includes(this.searchText.toLowerCase())) ||
                        (book.nhaXuatBan && book.nhaXuatBan.tenNXB.toLowerCase().includes(this.searchText.toLowerCase()))
                    );
                } else {
                    this.books = await SachService.getAll();
                }
            } catch (error) {
                console.error("Error searching books:", error);
            } finally {
                this.loading = false;
            }
        }
    },
    created() {
        this.loadBooks();
    }
};
</script>

<style scoped>
.card-img-container {
    height: 250px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8f9fa;
}

.card-img-container img {
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
}

.card {
    transition: transform 0.3s;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card:hover {
    transform: translateY(-5px);
}
</style>