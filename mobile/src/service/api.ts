import axios from "axios";

/* Criando uma instância do axios com um baseURL. */
export const api = axios.create({
  baseURL: "http://192.168.0.10:8080"
});
