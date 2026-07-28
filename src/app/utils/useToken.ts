export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("fianut_auth_token") || null;
  }
  return null;
};
