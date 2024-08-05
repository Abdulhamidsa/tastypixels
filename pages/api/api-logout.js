export default function handler(req, res) {
  res.setHeader("Set-Cookie", "refreshToken=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict");
  return res.status(200).json({ message: "Logout successful" });
}
