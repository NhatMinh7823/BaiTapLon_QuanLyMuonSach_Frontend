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
                            <i class="fas fa-user mr-1"></i> {{ userName }}
                        </a>
                        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
                            <a class="dropdown-item" href="#" @click.prevent="logout">
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
import AuthService from '@/services/auth.service'

export default {
    name: 'AppHeader',
    data() {
        return {
            currentUser: null
        }
    },
    computed: {
        isLoggedIn() {
            return !!this.currentUser
        },
        isAdmin() {
            return this.currentUser && this.currentUser.role === 'admin'
        },
        userName() {
            if (!this.currentUser) return ''

            if (this.currentUser.hoLot && this.currentUser.ten) {
                return `${this.currentUser.hoLot} ${this.currentUser.ten}`
            } else if (this.currentUser.hoTenNV) {
                return this.currentUser.hoTenNV
            }

            return this.currentUser.email || 'Người dùng'
        }
    },
    methods: {
        logout() {
            AuthService.logout()
            this.currentUser = null
            this.$router.push('/login')
        }
    },
    created() {
        this.currentUser = AuthService.getCurrentUser()
    }
}
</script>