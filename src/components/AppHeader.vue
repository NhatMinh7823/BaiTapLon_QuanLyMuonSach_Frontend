<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container">
            <router-link class="navbar-brand" to="/">
                <i class="fas fa-book-open mr-2"></i>
                Thư viện sách
            </router-link>

            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/books">
                            <i class="fas fa-book mr-1"></i> Danh mục sách
                        </router-link>
                    </li>

                    <!-- Menu items for authenticated users -->
                    <template v-if="isLoggedIn">
                        <!-- User menu items -->
                        <li class="nav-item" v-if="!isAdmin">
                            <router-link class="nav-link" to="/user">
                                <i class="fas fa-home mr-1"></i> Trang cá nhân
                            </router-link>
                        </li>
                        <li class="nav-item" v-if="!isAdmin">
                            <router-link class="nav-link" to="/user/borrow-history">
                                <i class="fas fa-history mr-1"></i> Lịch sử mượn sách
                            </router-link>
                        </li>

                        <!-- Admin menu items -->
                        <li class="nav-item" v-if="isAdmin">
                            <router-link class="nav-link" to="/admin">
                                <i class="fas fa-tachometer-alt mr-1"></i> Quản trị
                            </router-link>
                        </li>
                        <li class="nav-item dropdown" v-if="isAdmin">
                            <a class="nav-link dropdown-toggle" href="#" id="adminDropdown" role="button"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fas fa-cogs mr-1"></i> Quản lý
                            </a>
                            <div class="dropdown-menu" aria-labelledby="adminDropdown">
                                <router-link class="dropdown-item" to="/admin/books">
                                    <i class="fas fa-book mr-1"></i> Quản lý sách
                                </router-link>
                                <router-link class="dropdown-item" to="/admin/publishers">
                                    <i class="fas fa-building mr-1"></i> Quản lý NXB
                                </router-link>
                                <router-link class="dropdown-item" to="/admin/borrow-requests">
                                    <i class="fas fa-clipboard-list mr-1"></i> Duyệt yêu cầu mượn
                                </router-link>
                                <router-link class="dropdown-item" to="/admin/users">
                                    <i class="fas fa-users mr-1"></i> Quản lý người dùng
                                </router-link>
                            </div>
                        </li>
                    </template>
                </ul>

                <ul class="navbar-nav">
                    <!-- Guest menu items -->
                    <template v-if="!isLoggedIn">
                        <li class="nav-item">
                            <router-link class="nav-link" to="/login">
                                <i class="fas fa-sign-in-alt mr-1"></i> Đăng nhập
                            </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/register">
                                <i class="fas fa-user-plus mr-1"></i> Đăng ký
                            </router-link>
                        </li>
                    </template>

                    <!-- User dropdown when logged in -->
                    <li class="nav-item dropdown" v-if="isLoggedIn">
                        <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fas fa-user mr-1"></i> {{ displayName }}
                        </a>
                        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
                            <a class="dropdown-item" @click="handleLogout">
                                <i class="fas fa-sign-out-alt mr-1"></i> Đăng xuất
                            </a>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
import { inject, computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
    name: "AppHeader",
    setup() {
        const auth = inject('auth');
        const router = useRouter();

        // Computed properties
        const displayName = computed(() => {
            if (!auth.user.value) return '';

            if (auth.user.value.hoLot && auth.user.value.ten) {
                return `${auth.user.value.hoLot} ${auth.user.value.ten}`;
            } else if (auth.user.value.hoTenNV) {
                return auth.user.value.hoTenNV;
            }

            return auth.user.value.email || 'Người dùng';
        });

        // Methods
        const handleLogout = () => {
            auth.logout();
            router.push('/login');
        };

        return {
            // Expose properties and methods
            isLoggedIn: auth.isLoggedIn,
            isAdmin: auth.isAdmin,
            displayName,
            handleLogout
        };
    }
};
</script>

<style scoped>
.navbar {
    margin-bottom: 1rem;
}
</style>