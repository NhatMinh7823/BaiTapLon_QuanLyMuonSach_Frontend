<template>
    <div class="login-page">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header bg-primary text-white">
                        <h3 class="mb-0">{{ isAdminLogin ? 'Đăng nhập quản trị' : 'Đăng nhập' }}</h3>
                    </div>
                    <div class="card-body">
                        <div v-if="message" class="alert" :class="successful ? 'alert-success' : 'alert-danger'">
                            {{ message }}
                        </div>

                        <form @submit.prevent="handleLogin">
                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" class="form-control" id="email" v-model="user.email" required
                                    placeholder="Nhập email của bạn">
                            </div>

                            <div class="form-group">
                                <label for="password">Mật khẩu</label>
                                <input type="password" class="form-control" id="password" v-model="user.password"
                                    required placeholder="Nhập mật khẩu">
                            </div>

                            <div class="form-group form-check">
                                <input type="checkbox" class="form-check-input" id="isAdminLogin"
                                    v-model="isAdminLogin">
                                <label class="form-check-label" for="isAdminLogin">
                                    Đăng nhập với tư cách quản trị viên
                                </label>
                            </div>

                            <div class="form-group">
                                <button class="btn btn-primary btn-block" :disabled="loading">
                                    <span v-if="loading" class="spinner-border spinner-border-sm mr-1"></span>
                                    <i v-else class="fas fa-sign-in-alt mr-1"></i>
                                    {{ isAdminLogin ? 'Đăng nhập quản trị' : 'Đăng nhập' }}
                                </button>
                            </div>
                        </form>

                        <div class="mt-3 text-center">
                            <p>Chưa có tài khoản? <router-link to="/register">Đăng ký ngay</router-link></p>
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
    name: "Login",
    data() {
        return {
            user: {
                email: "",
                password: ""
            },
            loading: false,
            message: "",
            successful: false,
            isAdminLogin: false
        };
    },
    methods: {
        handleLogin() {
            this.loading = true;
            this.message = "";

            AuthService.login({
                email: this.user.email,
                password: this.user.password,
                isAdmin: this.isAdminLogin
            }).then(
                () => {
                    this.successful = true;
                    this.message = "Đăng nhập thành công!";

                    // Redirect based on user role
                    const user = AuthService.getCurrentUser();
                    if (user.role === "admin") {
                        this.$router.push("/admin");
                    } else {
                        const redirectPath = this.$route.query.redirect || "/user";
                        this.$router.push(redirectPath);
                    }
                },
                error => {
                    this.successful = false;
                    this.message = (error.response && error.response.data && error.response.data.message) ||
                        error.message ||
                        error.toString();
                    this.loading = false;
                }
            );
        }
    }
};
</script>