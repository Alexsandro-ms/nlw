import axios from "axios";

/* Criando uma instância axios com um URL base de http://localhost:8080/ */
export const api = axios.create({
  baseURL: "http://localhost:8080/"
});
