import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://hrdashboard-vjkj.onrender.com/api",
  headers: { "Content-Type": "application/json" }
});

export function getEmployees(search) {
  return api.get("/employees", {
    params: search ? { search } : undefined
  });
}

export function getEmployee(id) {
  return api.get(`/employees/${id}`);
}

export function createEmployee(data) {
  return api.post("/employees", data);
}

export function updateEmployee(id, data) {
  return api.put(`/employees/${id}`, data);
}

export function deleteEmployee(id) {
  return api.delete(`/employees/${id}`);
}

export default api;
