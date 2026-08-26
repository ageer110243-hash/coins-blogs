import axios from "axios";

// Local dev: frontend (5173) and backend (3000) are separate servers, so
// this needs the full localhost URL.
// Production: frontend and backend are two separate Vercel projects on two
// different domains — set VITE_API_URL in the frontend project's
// Environment Variables to the backend project's full URL + /api,
// e.g. https://coins-blogs-backend.vercel.app/api
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
});
