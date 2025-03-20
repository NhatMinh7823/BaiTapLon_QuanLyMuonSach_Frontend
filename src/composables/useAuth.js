import { ref, reactive, computed } from "vue";
import AuthService from "@/services/auth.service";

// State sẽ được chia sẻ giữa các components
const user = ref(null);
const isLoading = ref(false);
const error = ref(null);

// Khởi tạo state từ localStorage khi app khởi động
user.value = AuthService.getCurrentUser();

export function useAuth() {
  const isLoggedIn = computed(() => !!user.value);
  const isAdmin = computed(() => user.value && user.value.role === "admin");

  // Hàm đăng nhập
  const login = async (credentials) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await AuthService.login(credentials);
      user.value = response; // Cập nhật state sau khi đăng nhập thành công
      return response;
    } catch (err) {
      error.value =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  // Hàm đăng xuất
  const logout = () => {
    AuthService.logout();
    user.value = null; // Cập nhật state sau khi đăng xuất
  };

  // Hàm đăng ký
  const register = async (userData) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await AuthService.register(userData);
      return response;
    } catch (err) {
      error.value =
        (err.response && err.response.data && err.response.data.message) ||
        err.message ||
        err.toString();
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    user,
    isLoading,
    error,
    isLoggedIn,
    isAdmin,
    login,
    logout,
    register,
  };
}
