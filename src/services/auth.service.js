import createApiClient from "./api.service";

class AuthService {
  constructor(baseUrl = "/api/auth") {
    this.api = createApiClient(baseUrl);
  }

  async register(data) {
    return (await this.api.post("/register", data)).data;
  }

  async login(data) {
    const response = (await this.api.post("/login", data)).data;
    if (response.accessToken) {
      localStorage.setItem("token", response.accessToken);
      localStorage.setItem("user", JSON.stringify(response));
    }
    return response;
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!localStorage.getItem("token");
  }

  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === "admin";
  }
}

export default new AuthService();
