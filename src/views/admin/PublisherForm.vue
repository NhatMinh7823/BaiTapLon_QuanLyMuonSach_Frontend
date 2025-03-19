<!-- src/views/admin/PublisherForm.vue -->
<template>
    <div class="admin-publisher-form">
        <h1 class="page-title">{{ isEditMode ? 'Chỉnh sửa nhà xuất bản' : 'Thêm nhà xuất bản mới' }}</h1>

        <div v-if="loading" class="text-center my-5">
            <div class="spinner-border text-primary" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            <p class="mt-2">{{ isEditMode ? 'Đang tải thông tin nhà xuất bản...' : 'Đang tải dữ liệu...' }}</p>
        </div>

        <div v-else class="card">
            <div class="card-header bg-primary text-white">
                <h4 class="mb-0">{{ isEditMode ? 'Thông tin nhà xuất bản' : 'Nhập thông tin nhà xuất bản mới' }}</h4>
            </div>
            <div class="card-body">
                <form @submit.prevent="savePublisher">
                    <div class="form-group">
                        <label for="tenNXB">Tên nhà xuất bản <span class="text-danger">*</span></label>
                        <input type="text" class="form-control" id="tenNXB" v-model="publisher.tenNXB" required
                            placeholder="Nhập tên nhà xuất bản">
                    </div>

                    <div class="form-group">
                        <label for="diaChi">Địa chỉ</label>
                        <textarea class="form-control" id="diaChi" v-model="publisher.diaChi" rows="3"
                            placeholder="Nhập địa chỉ nhà xuất bản"></textarea>
                    </div>

                    <div v-if="message" class="alert" :class="successful ? 'alert-success' : 'alert-danger'">
                        {{ message }}
                    </div>

                    <div class="form-group text-right">
                        <router-link to="/admin/publishers" class="btn btn-secondary mr-2">
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
import NhaXuatBanService from "@/services/nhaxuatban.service";

export default {
    name: "AdminPublisherForm",
    props: {
        id: { type: String, required: false }
    },
    data() {
        return {
            publisher: {
                tenNXB: "",
                diaChi: ""
            },
            loading: true,
            saving: false,
            message: "",
            successful: false
        };
    },
    computed: {
        isEditMode() {
            return !!this.id;
        }
    },
    methods: {
        async loadData() {
            try {
                // If in edit mode, load the publisher data
                if (this.isEditMode) {
                    const publisherData = await NhaXuatBanService.get(this.id);
                    this.publisher = {
                        tenNXB: publisherData.tenNXB || "",
                        diaChi: publisherData.diaChi || ""
                    };
                }
            } catch (error) {
                console.error("Error loading data:", error);
                this.message = "Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.";
                this.successful = false;
            } finally {
                this.loading = false;
            }
        },
        async savePublisher() {
            this.saving = true;
            this.message = "";

            try {
                if (this.isEditMode) {
                    // Update existing publisher
                    await NhaXuatBanService.update(this.id, this.publisher);
                    this.message = "Cập nhật nhà xuất bản thành công!";
                } else {
                    // Create new publisher
                    await NhaXuatBanService.create(this.publisher);
                    this.message = "Thêm nhà xuất bản mới thành công!";

                    // Reset form for new entry
                    this.publisher = {
                        tenNXB: "",
                        diaChi: ""
                    };
                }

                this.successful = true;
            } catch (error) {
                console.error("Error saving publisher:", error);
                this.message = "Có lỗi xảy ra khi lưu thông tin nhà xuất bản. Vui lòng thử lại sau.";
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
.form-group {
    margin-bottom: 1.5rem;
}

.text-right {
    text-align: right;
}

.text-danger {
    color: #dc3545;
}

.card {
    margin-bottom: 2rem;
    box-shadow: 0 .125rem .25rem rgba(0, 0, 0, .075);
}
</style>