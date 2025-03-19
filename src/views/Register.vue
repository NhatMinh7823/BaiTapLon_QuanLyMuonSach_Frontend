<template>
    <div class="register-page">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header bg-success text-white">
                        <h3 class="mb-0">Đăng ký tài khoản</h3>
                    </div>
                    <div class="card-body">
                        <div v-if="message" class="alert" :class="successful ? 'alert-success' : 'alert-danger'">
                            {{ message }}
                        </div>

                        <form @submit.prevent="handleRegister" v-if="!successful">
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="hoLot">Họ lót</label>
                                    <input type="text" class="form-control" id="hoLot" v-model="user.hoLot" required
                                        placeholder="Họ lót">
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="ten">Tên</label>
                                    <input type="text" class="form-control" id="ten" v-model="user.ten" required
                                        placeholder="Tên">
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" class="form-control" id="email" v-model="user.email" required
                                    placeholder="Email">
                            </div>

                            <div class="form-group">
                                <label for="password">Mật khẩu</label>
                                <input type="password" class="form-control" id="password" v-model="user.password"
                                    required placeholder="Mật khẩu (tối thiểu 6 ký tự)" minlength="6">
                            </div>

                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="ngaySinh">Ngày sinh</label>
                                    <input type="date" class="form-control" id="ngaySinh" v-model="user.ngaySinh"
                                        required>
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="phai">Giới tính</label>
                                    <select class="form-control" id="phai" v-model="user.phai" required>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                        <option value="Khác">Khác</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="diaChi">Địa chỉ</label>
                                <input type="text" class="form-control" id="diaChi" v-model="user.diaChi" required
                                    placeholder="Địa chỉ">
                            </div>

                            <div class="form-group">
                                <label for="dienThoai">Số điện thoại</label>
                                <input type="tel" class="form-control" id="dienThoai" v-model="user.dienThoai" required
                                    placeholder="Số điện thoại">
                            </div>

                            <div class="form-group">
                                <button class="btn btn-success btn-block" :disabled="loading">
                                    <span v-if="loading" class="spinner-border spinner-border-sm mr-1"></span>
                                    <i v-else class="fas fa-user-plus mr-1"></i>
                                    Đăng ký
                                </button>
                            </div>
                        </form>

                        <div class="mt-3 text-center" v-if="!successful">
                            <p>Đã có tài khoản? <router-link to="/login">Đăng nhập ngay</router-link></p>
                        </div>

                        <div class="text-center" v-if="successful">
                            <router-link to="/login" class="btn btn-primary">
                                <i class="fas fa-sign-in-alt mr-1"></i> Đăng nhập ngay
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

export default {
    name: "Register",
    data() {
        return {
            user: {
                hoLot: "",
                ten: "",
                email: "",
                password: "",
                ngaySinh: "",
                phai: "Nam",
                diaChi: "",
                dienThoai: ""
            },
            loading: false,
            message: "",
            successful: false
        };
    },
    methods: {
        handleRegister() {
            this.message = "";
            this.loading = true;

            AuthService.register(this.user).then(
                response => {
                    this.message = "Đăng ký tài khoản thành công!";
                    this.successful = true;
                    this.loading = false;
                },
                error => {
                    this.message =
                        (error.response && error.response.data && error.response.data.message) ||
                        error.message ||
                        error.toString();
                    this.successful = false;
                    this.loading = false;
                }
            );
        }
    }
};
</script>