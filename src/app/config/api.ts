const API_BASE = process.env.NEXT_PUBLIC_FIANUT_BE_URL;
const base = `${API_BASE}/api`;

export const api = {
  logout: `${base}/logout`,
  verifyToken: `${base}/verify-token`,
  profile: `${base}/instance/profile`,
  clockIn: `${base}/timein/clock-in`,
  clockOut: `${base}/timein/clock-out`,
  today: `${base}/timein/today`,
  history: `${base}/timein/history`,
  report: `${base}/timein/report`,
};
