<template>
    <div class="not-found text-center">
        <h1 class="display-4 mb-4">404 - Trang không tồn tại</h1>
        <p class="lead">Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
        <!-- <img src="/img/404.svg" alt="404 Not Found" class="my-4" style="max-width: 400px;"> -->
        <div class="mt-4">
            <router-link to="/" class="btn btn-primary btn-lg">
                <i class="fas fa-home mr-1"></i> Quay về trang chủ
            </router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: "NotFound"
};
</script>

<style scoped>
.not-found {
    padding: 50px 0;
}
</style>
