// Centralized API configuration
// In production, use relative URLs so the frontend calls its own domain
// The proxy in vite.config.js handles localhost, and in production the backend should be on the same domain or CORS-enabled
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export default API_BASE_URL;
