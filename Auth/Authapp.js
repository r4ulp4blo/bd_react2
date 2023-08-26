const jwt = require('jsonwebtoken');

// Middleware de autorización
function verificaToken(req, res, next) {
  // Obtiene el token del encabezado de la solicitud
  const token = req.header('x-auth-token');

  // Verifica si el token no está presente
  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    // Verifica y decodifica el token
    const decoded = jwt.verify(token, 'secreto-seguro'); // Reemplaza 'secreto-seguro' por tu secreto real

    // Añade el usuario decodificado a la solicitud para su uso posterior
    req.usuario = decoded;

    // Continúa con la siguiente función de middleware
    next();
  } catch (excepcion) {
    res.status(400).json({ mensaje: 'Token no válido.' });
  }
}

module.exports = verificaToken;
