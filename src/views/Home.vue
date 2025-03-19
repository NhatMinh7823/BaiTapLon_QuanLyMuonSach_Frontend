<template>
    <div class="home">
        <div class="jumbotron">
            <h1 class="display-4">Thư viện sách trực tuyến</h1>
            <p class="lead">
                Hệ thống quản lý mượn sách trực tuyến giúp bạn dễ dàng tìm kiếm và mượn sách mà không cần đến thư viện.
            </p>
            <hr class="my-4">
            <p>Đăng nhập để mượn sách hoặc xem danh mục sách hiện có.</p>
            <div class="buttons">
                <router-link to="/login" class="btn btn-primary btn-lg mr-2" v-if="!isLoggedIn">
                    <i class="fas fa-sign-in-alt mr-1"></i> Đăng nhập
                </router-link>
                <router-link to="/register" class="btn btn-success btn-lg mr-2" v-if="!isLoggedIn">
                    <i class="fas fa-user-plus mr-1"></i> Đăng ký
                </router-link>
                <router-link to="/books" class="btn btn-info btn-lg">
                    <i class="fas fa-book mr-1"></i> Xem danh mục sách
                </router-link>
            </div>
        </div>

        <div class="row mt-5">
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <div class="card-body text-center">
                        <i class="fas fa-search fa-3x mb-3 text-primary"></i>
                        <h4 class="card-title">Tìm kiếm sách</h4>
                        <p class="card-text">Dễ dàng tìm kiếm sách theo tên, tác giả hoặc nhà xuất bản.</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <div class="card-body text-center">
                        <i class="fas fa-laptop fa-3x mb-3 text-success"></i>
                        <h4 class="card-title">Đăng ký mượn trực tuyến</h4>
                        <p class="card-text">Đăng ký mượn sách trực tuyến mà không cần đến thư viện.</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <div class="card-body text-center">
                        <i class="fas fa-history fa-3x mb-3 text-info"></i>
                        <h4 class="card-title">Theo dõi lịch sử mượn</h4>
                        <p class="card-text">Dễ dàng theo dõi sách đã mượn và trạng thái mượn sách.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AuthService from "@/services/auth.service";

export default {
    name: "Home",
    computed: {
        isLoggedIn() {
            return AuthService.isAuthenticated();
        }
    }
};
</script>

<style scoped>
.jumbotron {
    background-color: #f8f9fa;
    padding: 3rem 2rem;
    border-radius: 0.5rem;
}

.buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.card {
    transition: transform 0.3s;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card:hover {
    transform: translateY(-5px);
}
</style>