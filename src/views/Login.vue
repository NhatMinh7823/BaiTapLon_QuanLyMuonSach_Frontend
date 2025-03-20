<template>
    <div class="login-page">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header bg-primary text-white">
                        <h3 class="mb-0">{{ isAdminLogin ? 'Đăng nhập quản trị' : 'Đăng nhập' }}</h3>
                    </div>
                    <div class="card-body">
                        <div v-if="error" class="alert alert-danger">
                            {{ error }}
                        </div>
                        <div v-if="successMessage" class="alert alert-success">
                            {{ successMessage }}
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
                                <button class="btn btn-primary btn-block" :disabled="isLoading">
                                    <span v-if="isLoading" class="spinner-border spinner-border-sm mr-1"></span>
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
import { ref, inject, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default {
    name: "Login",
    setup() {
        const auth = inject('auth');
        const router = useRouter();
        const route = useRoute();

        // Reactive state
        const user = reactive({
            email: "",
            password: ""
        });
        const isAdminLogin = ref(false);
        const successMessage = ref('');

        // Methods
        const handleLogin = async () => {
            try {
                await auth.login({
                    email: user.email,
                    password: user.password,
                    isAdmin: isAdminLogin.value
                });

                successMessage.value = "Đăng nhập thành công!";

                // Redirect based on user role
                if (auth.isAdmin.value) {
                    router.push("/admin");
                } else {
                    const redirectPath = route.query.redirect || "/user";
                    router.push(redirectPath);
                }
            } catch (error) {
                // Error được xử lý trong composable
                console.error("Đăng nhập thất bại:", error);
            }
        };

        return {
            user,
            isAdminLogin,
            successMessage,
            error: auth.error,
            isLoading: auth.isLoading,
            handleLogin
        };
    }
};
</script>