import createApiClient from "./api.service";

class SachService {
  constructor(baseUrl = "/api/sach") {
    this.api = createApiClient(baseUrl);
  }

  async getAll() {
    return (await this.api.get("/")).data;
  }

  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }

  async create(data) {
    // Use FormData for file uploads
    const formData = new FormData();

    // Append all fields to FormData
    Object.keys(data).forEach((key) => {
      if (key === "anhBia" && data[key] instanceof File) {
        formData.append(key, data[key]);
      } else {
        formData.append(key, data[key]);
      }
    });

    return (
      await this.api.post("/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    ).data;
  }

  async update(id, data) {
    // Check if there's a file to upload
    if (data.anhBia instanceof File) {
      const formData = new FormData();

      // Append all fields to FormData
      Object.keys(data).forEach((key) => {
        if (key === "anhBia") {
          formData.append(key, data[key]);
        } else {
          formData.append(key, data[key]);
        }
      });

      return (
        await this.api.put(`/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      ).data;
    } else {
      // Regular update without file
      return (await this.api.put(`/${id}`, data)).data;
    }
  }

  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }

  async deleteAll() {
    return (await this.api.delete("/")).data;
  }
}

export default new SachService();
