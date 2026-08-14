// ===============================
// CONFIGURAÇÃO DA API
// ===============================
const API = "https://add-leitura.leituraepbenergisa.workers.dev";

function getToken() {
  return localStorage.getItem("token");
}

function setSession(data) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

function isLogged() {
  return !!getToken();
}

function logout() {
  localStorage.clear();
  window.location.href =
    "https://github.com/leituraepbenergisa-ui/Login-Leitura";
}

async function authFetch(url, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.headers || {}),
    "Authorization": `Bearer ${token}`
  };

  const resp = await fetch(url, {
    ...options,
    headers
  });

  // 🔥 NÃO AUTENTICADO
  if (resp.status === 401) {
    alert("Sessão expirada. Faça login novamente.");
    logout();
    return resp;
  }

  // 🔥 NÃO AUTORIZADO (ADMIN)
  if (resp.status === 403) {
    alert("🚫 USUÁRIO NÃO AUTORIZADO");

    // redireciona pro ADD
    window.location.href = "https://github.com/leituraepbenergisa-ui/ADD_Leitura/";
    return resp;
  }

  return resp;
}
