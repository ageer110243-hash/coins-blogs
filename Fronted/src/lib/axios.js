import axios from "axios";

// Local dev: frontend (5173) and backend (3000) are separate servers, so
// this needs the full localhost URL.
// Production: frontend and backend are deployed together as one Vercel
// project (see root vercel.json), so VITE_API_URL is just "/api" — same
// origin, no CORS, simplest possible cookie behaviour.
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
});
