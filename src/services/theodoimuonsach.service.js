import createApiClient from "./api.service";

class TheoDoiMuonSachService {
  constructor(baseUrl = "/api/theodoimuonsach") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }

  async getMyRequests(userId) {
    return (await this.api.get(`/?maDocGia=${userId}`)).data;
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async create(data) {
    return (await this.api.post("/", data)).data;
  }

  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }

  async approve(id, staffId) {
    return (
      await this.api.put(`/${id}`, {
        trangThai: "approved",
        maNhanVienDuyet: staffId,
      })
    ).data;
  }

  async reject(id, staffId) {
    return (
      await this.api.put(`/${id}`, {
        trangThai: "rejected",
        maNhanVienDuyet: staffId,
      })
    ).data;
  }

  async markAsReturned(id) {
    return (
      await this.api.put(`/${id}`, {
        trangThai: "returned",
        ngayTra: new Date().toISOString(),
      })
    ).data;
  }
}

export default new TheoDoiMuonSachService();
