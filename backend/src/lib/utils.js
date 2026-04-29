import jwt from "jsonwebtoken";

const isProduction = process.env.NODE_ENV === "production";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    httpOnly: true,                   // prevent XSS
    sameSite: isProduction ? "none" : "lax",  // "none" required for cross-domain (Vercel → Render)
    secure: isProduction,             // "none" requires secure:true
  });

  return token;
};
