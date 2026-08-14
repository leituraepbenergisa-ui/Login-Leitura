// ===============================
// CONFIGURAÇÃO DA API
// ===============================
const API = "https://add-leitura.leituraepbenergisa.workers.dev";

// ===============================
// SESSÃO
// ===============================
function setSession(data) {
  if (!data || !data.token || !data.user) {
    console.error("Dados de sessão inválidos:", data);
    return;
  }

  const user = data.user;

  localStorage.setItem("token", data.token);

  localStorage.setItem("usuarioLogado", JSON.stringify({
    matricula: user.matricula || "",
    nome: user.nome || "",
    email: user.email || "",
    regional: user.regional || "",
    polo: user.polo || "",
    base: user.base || "",
    role: user.role || "user"
  }));

  localStorage.setItem("matricula", user.matricula || "");
  localStorage.setItem("nome", user.nome || "");
  localStorage.setItem("email", user.email || "");
  localStorage.setItem("regional", user.regional || "");
  localStorage.setItem("polo", user.polo || "");
  localStorage.setItem("base", user.base || "");
  localStorage.setItem("role", user.role || "user");
}

function getSession() {
  const raw = localStorage.getItem("usuarioLogado");

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Erro ao ler sessão:", e);
    return null;
  }
}

function getToken() {
  return localStorage.getItem("token") || "";
}

function isLogged() {
  return !!getToken();
}

function logout() {
  localStorage.clear();
  window.location.href = "https://leituraepbenergisa-ui.github.io/Login-Leitura/";
}

function authHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
}

function usuarioAtual() {
  return getSession();
}

// ===============================
// PROTEÇÃO DE PÁGINA
// ===============================
function protegerPagina() {
  if (!isLogged()) {
    window.location.href = "https://leituraepbenergisa-ui.github.io/Login-Leitura/";
    return false;
  }

  return true;
}

// ===============================
// CARREGAR DADOS ATUALIZADOS DO /ME
// ===============================
async function atualizarSessaoPeloMe() {
  try {
    const resp = await fetch(`${API}/me`, {
      method: "GET",
      headers: authHeaders()
    });

    const data = await resp.json();

    if (!data.ok) {
      console.warn("Não foi possível atualizar sessão:", data);
      return null;
    }

    const token = getToken();

    setSession({
      token,
      user: data.user
    });

    return data.user;

  } catch (err) {
    console.error("Erro ao atualizar sessão:", err);
    return null;
  }
}
