<template>
    <div class="admin-book-form">
        <h1 class="page-title">{{ isEditMode ? 'Chỉnh sửa sách' : 'Thêm sách mới' }}</h1>

        <div v-if="loading" class="text-center my-5">
            <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            <p class="mt-2">{{ isEditMode ? 'Đang tải thông tin sách...' : 'Đang tải dữ liệu...' }}</p>
        </div>

        <div v-else class="card">
            <div class="card-header bg-primary text-white">
                <h4 class="mb-0">{{ isEditMode ? 'Thông tin sách' : 'Nhập thông tin sách mới' }}</h4>
            </div>
            <div class="card-body">
                <form @submit.prevent="saveBook">
                    <div class="row">
                        <div class="col-md-8">
                            <div class="form-group">
                                <label for="tenSach">Tên sách <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="tenSach" v-model="book.tenSach" required
                                    placeholder="Nhập tên sách">
                            </div>

                            <div class="form-group">
                                <label for="nguonGocTacGia">Tác giả</label>
                                <input type="text" class="form-control" id="nguonGocTacGia"
                                    v-model="book.nguonGocTacGia" placeholder="Nhập tên tác giả">
                            </div>

                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="namXuatBan">Năm xuất bản</label>
                                    <input type="number" class="form-control" id="namXuatBan" v-model="book.namXuatBan"
                                        placeholder="Nhập năm xuất bản" min="1800" :max="currentYear">
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="maNXB">Nhà xuất bản</label>
                                    <select class="form-control" id="maNXB" v-model="book.maNXB">
                                        <option value="">-- Chọn nhà xuất bản --</option>
                                        <option v-for="publisher in publishers" :key="publisher._id"
                                            :value="publisher._id">
                                            {{ publisher.tenNXB }}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="donGia">Đơn giá</label>
                                    <div class="input-group">
                                        <input type="number" class="form-control" id="donGia" v-model="book.donGia"
                                            placeholder="Nhập đơn giá" min="0">
                                        <div class="input-group-append">
                                            <span class="input-group-text">VNĐ</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="soQuyen">Số quyển</label>
                                    <input type="number" class="form-control" id="soQuyen" v-model="book.soQuyen"
                                        placeholder="Nhập số quyển" min="0">
                                </div>
                            </div>
                        </div>

                        <div class="col-md-4">
                            <div class="form-group">
                                <label for="anhBia">Ảnh bìa</label>
                                <div class="cover-preview mb-2">
                                    <img :src="coverPreview || '/img/default-book-cover.jpg'" class="img-fluid"
                                        alt="Book cover preview">
                                </div>
                                <div class="custom-file">
                                    <input type="file" class="custom-file-input" id="anhBia" ref="fileInput"
                                        @change="handleFileUpload" accept="image/*">
                                    <label class="custom-file-label" for="anhBia">
                                        {{ fileLabel }}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="message" class="alert" :class="successful ? 'alert-success' : 'alert-danger'">
                        {{ message }}
                    </div>

                    <div class="form-group text-right">
                        <router-link to="/admin/books" class="btn btn-secondary mr-2">
                            <i class="fas fa-arrow-left mr-1"></i> Quay lại
                        </router-link>
                        <button type="submit" class="btn btn-primary" :disabled="saving">
                            <span v-if="saving" class="spinner-border spinner-border-sm mr-1"></span>
                            <i v-else class="fas fa-save mr-1"></i>
                            {{ isEditMode ? 'Cập nhật' : 'Lưu' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import AuthService from "@/services/auth.service";
import SachService from "@/services/sach.service";
import NhaXuatBanService from "@/services/nhaxuatban.service";

export default {
    name: "AdminBookForm",
    props: {
        id: { type: String, required: false }
    },
    data() {
        return {
            book: {
                tenSach: "",
                nguonGocTacGia: "",
                donGia: 0,
                soQuyen: 0,
                namXuatBan: new Date().getFullYear(),
                maNXB: ""
            },
            publishers: [],
            loading: true,
            saving: false,
            message: "",
            successful: false,
            selectedFile: null,
            fileLabel: "Chọn file ảnh",
            coverPreview: null
        };
    },
    computed: {
        isEditMode() {
            return !!this.id;
        },
        currentYear() {
            return new Date().getFullYear();
        }
    },
    methods: {
        async loadData() {
            try {
                // Load publishers
                this.publishers = await NhaXuatBanService.getAll();

                // If in edit mode, load the book data
                if (this.isEditMode) {
                    const bookData = await SachService.get(this.id);
                    this.book = {
                        tenSach: bookData.tenSach || "",
                        nguonGocTacGia: bookData.nguonGocTacGia || "",
                        donGia: bookData.donGia || 0,
                        soQuyen: bookData.soQuyen || 0,
                        namXuatBan: bookData.namXuatBan || new Date().getFullYear(),
                        maNXB: bookData.maNXB || ""
                    };

                    if (bookData.anhBia) {
                        this.coverPreview = bookData.anhBia;
                    }
                }
            } catch (error) {
                console.error("Error loading data:", error);
                this.message = "Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.";
                this.successful = false;
            } finally {
                this.loading = false;
            }
        },
        handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            this.selectedFile = file;
            this.fileLabel = file.name;

            // Create a preview URL
            const reader = new FileReader();
            reader.onload = e => {
                this.coverPreview = e.target.result;
            };
            reader.readAsDataURL(file);
        },
        async saveBook() {
            this.saving = true;
            this.message = "";

            try {
                const bookData = { ...this.book };

                // Add the selected file if any
                if (this.selectedFile) {
                    bookData.anhBia = this.selectedFile;
                }

                if (this.isEditMode) {
                    // Update existing book
                    await SachService.update(this.id, bookData);
                    this.message = "Cập nhật sách thành công!";
                } else {
                    // Create new book
                    await SachService.create(bookData);
                    this.message = "Thêm sách mới thành công!";

                    // Reset form for new entry
                    this.book = {
                        tenSach: "",
                        nguonGocTacGia: "",
                        donGia: 0,
                        soQuyen: 0,
                        namXuatBan: new Date().getFullYear(),
                        maNXB: ""
                    };
                    this.selectedFile = null;
                    this.fileLabel = "Chọn file ảnh";
                    this.coverPreview = null;
                    this.$refs.fileInput.value = "";
                }

                this.successful = true;
            } catch (error) {
                console.error("Error saving book:", error);
                this.message = "Có lỗi xảy ra khi lưu thông tin sách. Vui lòng thử lại sau.";
                this.successful = false;
            } finally {
                this.saving = false;
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
.cover-preview {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 5px;
    overflow: hidden;
}

.cover-preview img {
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
}

.form-row {
    display: flex;
    flex-wrap: wrap;
    margin-right: -5px;
    margin-left: -5px;
}

.form-row>.form-group {
    padding-right: 5px;
    padding-left: 5px;
}

.text-right {
    text-align: right;
}

.custom-file-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>