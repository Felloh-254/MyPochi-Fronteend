const BASE_URL =
  import.meta.env.VITE_API_URL || "https://3efe-197-248-144-53.ngrok-free.app";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = localStorage.getItem("coffer_token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkErr) {
    throw new ApiError(`Could not reach the API at ${BASE_URL}`, 0);
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(
      data.error || `Request failed (${res.status})`,
      res.status,
    );
  }
  return data;
}

// Mirrors the routes registered in cmd/api/main.go of the budgetapp backend.
export const api = {
  register: (payload) =>
    request("/api/auth/register", {
      method: "POST",
      body: payload,
      auth: false,
    }),
  login: (payload) =>
    request("/api/auth/login", { method: "POST", body: payload, auth: false }),
  me: () => request("/api/me"),

  getBudgets: () => request("/api/budgets"),
  createBudget: (payload) =>
    request("/api/budgets", { method: "POST", body: payload }),
  updateBudget: (id, payload) =>
    request(`/api/budgets/${id}`, { method: "PUT", body: payload }),
  deleteBudget: (id) => request(`/api/budgets/${id}`, { method: "DELETE" }),

  getAccounts: () => request("/api/accounts"),
  createAccount: (payload) =>
    request("/api/accounts", { method: "POST", body: payload }),
  updateAccount: (id, payload) =>
    request(`/api/accounts/${id}`, { method: "PUT", body: payload }),
  deleteAccount: (id) => request(`/api/accounts/${id}`, { method: "DELETE" }),

  getTransactions: (query = "") => request(`/api/transactions${query}`),
  createTransaction: (payload) =>
    request("/api/transactions", { method: "POST", body: payload }),
  updateTransaction: (id, payload) =>
    request(`/api/transactions/${id}`, { method: "PUT", body: payload }),
  deleteTransaction: (id) =>
    request(`/api/transactions/${id}`, { method: "DELETE" }),

  getSummary: () => request("/api/summary"),
};
