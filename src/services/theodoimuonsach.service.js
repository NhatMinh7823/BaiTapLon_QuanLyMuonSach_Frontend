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
    // Trước khi cập nhật trạng thái, lấy dữ liệu hiện tại
    const currentRecord = await this.get(id);

    return (
      await this.api.put(`/${id}`, {
        trangThai: "approved",
        maNhanVienDuyet: staffId,
        // Đảm bảo giữ lại các trường quan trọng
        maDocGia: currentRecord.maDocGia,
        maSach: currentRecord.maSach,
      })
    ).data;
  }

  async reject(id, staffId) {
    // Trước khi cập nhật trạng thái, lấy dữ liệu hiện tại
    const currentRecord = await this.get(id);

    return (
      await this.api.put(`/${id}`, {
        trangThai: "rejected",
        maNhanVienDuyet: staffId,
        // Đảm bảo giữ lại các trường quan trọng
        maDocGia: currentRecord.maDocGia,
        maSach: currentRecord.maSach,
      })
    ).data;
  }

  async markAsReturned(id) {
    // Trước khi cập nhật trạng thái, lấy dữ liệu hiện tại
    const currentRecord = await this.get(id);

    return (
      await this.api.put(`/${id}`, {
        trangThai: "returned",
        ngayTra: new Date().toISOString(),
        // Đảm bảo giữ lại các trường quan trọng
        maDocGia: currentRecord.maDocGia,
        maSach: currentRecord.maSach,
        maNhanVienDuyet: currentRecord.maNhanVienDuyet,
      })
    ).data;
  }
}

export default new TheoDoiMuonSachService();
