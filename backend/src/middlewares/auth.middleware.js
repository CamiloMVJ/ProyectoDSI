import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Acceso denegado: Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Token verificado:", decoded);
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Acceso denegado: Token inválido o expirado" });
  }
}

export const checkRole = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user || !rolesPermitidos.includes(req.user.rol)) {
      return res
        .status(403)
        .json({ message: "Autorización denegada: Privilegios insuficientes" });
    }
    next();
  };
}
