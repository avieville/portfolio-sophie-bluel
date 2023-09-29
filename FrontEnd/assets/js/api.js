const API_URL = "http://localhost:5678/api";

export async function login(email, password) {

  const body = {
    email: email,
    password: password,
  };

  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    switch (response.status) {
      case 200:
        const data = await response.json();
        window.localStorage.setItem("token", data.token);
        return true;

      case 401:
      case 404:
        console.error("bad credentials");
        return false;

      default:
        return false;
    }

  } catch (error) {
    console.error(error.message);
    return false;
  }
}

export async function getWorks() {
  try {
    const response = await fetch(`${API_URL}/works`);
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

export async function addWork(formData, token) {
  try {
    let response = await fetch(`${API_URL}/works`, {
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

export async function deleteWork(id, token) {
  try {
    const response = await fetch(`${API_URL}/works/${id}`, {
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
