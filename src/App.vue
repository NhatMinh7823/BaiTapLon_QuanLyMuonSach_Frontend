<template>
  <div id="app">
    <AppHeader />
    <div class="container mt-4">
      <router-view />
    </div>
    <footer class="mt-5 py-3 text-center bg-light">
      <div class="container">
        <p class="mb-0">Hệ thống quản lý mượn sách trực tuyến &copy; {{ new Date().getFullYear() }}</p>
      </div>
    </footer>
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader.vue";

export default {
  name: "App",
  components: {
    AppHeader
  }
};
</script>

<style>
#app {
  font-family: 'Roboto', sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  flex: 1;
}

.page-title {
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.alert {
  margin-top: 1rem;
}
</style>
