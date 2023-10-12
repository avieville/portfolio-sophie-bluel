export class Http {
  constructor() {
    this.API_URL = "http://localhost:5678/api";
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

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      window.localStorage.setItem("token", data.token);
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }

  async fetchWorks() {
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

  async createWork(formData, token) {
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
