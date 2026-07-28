export const getProfile = () => {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("fianut_profile");
    return raw ? JSON.parse(raw) : null;
  }
  return null;
};
