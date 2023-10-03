export class ApiService {
  constructor() {
    if (!ApiService.instance) {
      this.API_URL = "http://localhost:5678/api";
      ApiService.instance = this;
    }
    return ApiService.instance;
  }

  async login(email, password) {
    const body = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch(`${this.API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      switch (response.status) {
        case 200:
          const data = await response.json();
          this.token = data.token;
          window.localStorage.setItem("token", this.token);
          return true;

        case 401:
        case 404:
          console.error("Mauvaises informations d'identification");
          return false;

        default:
          return false;
      }
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }

  async getWorks() {
    try {
      const response = await fetch(`${this.API_URL}/works`);
      if (!response.ok) {
        return [];
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  }

  async addWork(formData, token) {
    try {
      let response = await fetch(`${this.API_URL}/works`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      return response.ok;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }

  async deleteWork(id, token) {
    try {
      const response = await fetch(`${this.API_URL}/works/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }
}
