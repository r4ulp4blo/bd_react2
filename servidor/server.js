const express = require("express");
const cors = require("cors");
const app = express();
const { Pool } = require("pg");
const PORT = process.env.PORT || 5000;
const speakeasy = require("speakeasy")();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Authapp = require('../Auth/Authapp');
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//ingresa los datos necesarios para poder crear una conexion con la base de datos POSTGRESQL
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "biblio2",
  password: "admin123",
  port: 5432,
});

// Función para generar un token único
function generarToken() {
  return crypto.randomBytes(32).toString("hex");
}

// Ruta para habilitar 2FA y generar un token de recuperación de contraseña
app.post("/habilitar-2fa", Authapp, async (req, res) => {
  try {
    const { usuarioId } = req.body;

    // Verifica el rol del usuario antes de habilitar 2FA
    const usuario = await db.one(
      "SELECT * FROM usuario WHERE id_usuario = $1",
      usuarioId
    );

    if (usuario.rol !== "cliente") {
      return res
        .status(400)
        .json({ mensaje: "Solo los usuarios clientes pueden habilitar 2FA." });
    }

    // Genera un token de recuperación de contraseña único
    const tokenRecuperacion = generarToken();

    // Inserta el token en la base de datos asociado al usuario
    await db.none(
      "UPDATE usuario SET secreto_2fa = $1, token_recuperacion = $2 WHERE id_usuario = $3",
      [contraseñaHash, tokenRecuperacion, usuarioId]
    );

    res
      .status(201)
      .json({
        mensaje:
          "2FA habilitado con éxito para el usuario cliente. Token de recuperación generado.",
      });
  } catch (error) {
    console.error("Error al habilitar 2FA:", error);
    res.status(500).json({ mensaje: "Error en el servidor." });
  }
});

// Ruta para el registro de usuarios
app.post('/registro', Authapp, async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    // Verifica si el correo ya está en uso
    const usuarioExistente = await db.oneOrNone('SELECT * FROM usuario WHERE correo = $1', correo);

    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El correo ya está en uso.' });
    }

    // Realiza el hash de la contraseña antes de almacenarla en la base de datos
    const contraseñaHash = await bcrypt.hash(contrasena, 10);

    // Inserta el nuevo usuario en la base de datos
    await db.none('INSERT INTO usuario (correo, contrasena) VALUES ($1, $2)', [correo, contraseñaHash]);

    res.status(201).json({ mensaje: 'Usuario registrado con éxito.' });
  } catch (error) {
    console.error('Error en el registro de usuario:', error);
    res.status(500).json({ mensaje: 'Error en el servidor.' });
  }
});

// Ruta para el inicio de sesión de usuarios
app.post('/inicio-sesion', Authapp, async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    // Busca al usuario en la base de datos por correo
    const usuario = await db.oneOrNone('SELECT * FROM usuario WHERE correo = $1', correo);

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas.' });
    }

    // Verifica la contraseña
    const contraseñaValida = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!contraseñaValida) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas.' });
    }

    // Si las credenciales son válidas, puedes generar un token JWT aquí y devolverlo

    res.json({ mensaje: 'Inicio de sesión exitoso.' });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    res.status(500).json({ mensaje: 'Error en el servidor.' });
  }
});


// Ruta para la autenticación de doble factor
app.post('/autenticacion-2fa', Authapp, async (req, res) => {
  try {
    const { usuarioId, codigo2FA } = req.body;

    // Busca al usuario en la base de datos por ID
    const usuario = await db.one('SELECT * FROM usuario WHERE id_usuario = $1', usuarioId);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    // Verifica si el usuario tiene habilitado 2FA
    if (!usuario.secreto_2fa) {
      return res.status(400).json({ mensaje: 'El usuario no ha habilitado 2FA.' });
    }

    // Verifica el código OTP ingresado por el usuario
    const verificado = speakeasy.totp.verify({
      secret: usuario.secreto_2fa,
      encoding: 'base32',
      token: codigo2FA,
      window: 2, // Tolerancia de tiempo (en segundos)
    });

    if (verificado) {
      // Si el código es válido, permite el acceso
      res.json({ mensaje: 'Acceso permitido. Autenticación de doble factor exitosa.' });
    } else {
      res.status(401).json({ mensaje: 'Código OTP no válido.' });
    }
  } catch (error) {
    console.error('Error en la autenticación de doble factor:', error);
    res.status(500).json({ mensaje: 'Error en el servidor.' });
  }
});

// Ruta para la autenticación de doble factor (2FA)
app.post('/autenticacion-2fa-inicial', Authapp, async (req, res) => {
  try {
    const { usuarioId, codigo2FA } = req.body;

    // Busca al usuario en la base de datos por ID
    const usuario = await db.one('SELECT * FROM usuario WHERE id_usuario = $1', usuarioId);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    // Verifica el código OTP ingresado por el usuario
    const verificado = speakeasy.totp.verify({
      secret: usuario.secreto_2fa,
      encoding: 'base32',
      token: codigo2FA,
      window: 10, // Tolerancia de tiempo (en segundos)
    });

    if (verificado) {
      // Si el código es válido, permite el acceso
      res.json({ mensaje: 'Acceso permitido. Autenticación de doble factor exitosa.' });
    } else {
      res.status(401).json({ mensaje: 'Código OTP no válido.' });
    }
  } catch (error) {
    console.error('Error en la autenticación de doble factor:', error);
    res.status(500).json({ mensaje: 'Error en el servidor.' });
  }
});

const jwt = require('jsonwebtoken');

// Función para generar un token JWT
function generarTokenJWT(usuarioId) {
  const token = jwt.sign({ usuarioId }, 'secreto-seguro', { expiresIn: '1h' }); // Cambia 'secreto-seguro' por tu secreto real
  return token;
}

// Ruta para generar un token JWT después del inicio de sesión
app.post('/generar-token-jwt', Authapp, async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    // Verifica las credenciales del usuario en la base de datos (como en la ruta de inicio de sesión)

    // Si las credenciales son válidas, genera un token JWT
    const usuarioId = 123; // Reemplaza esto con el ID del usuario real desde la base de datos
    const token = generarTokenJWT(usuarioId);

    res.json({ token });
  } catch (error) {
    console.error('Error al generar el token JWT:', error);
    res.status(500).json({ mensaje: 'Error en el servidor.' });
  }
});


//funcion POST que almacena los datos, esta siendo usado en la API app.js
app.post("/agregar-libro", async (req, res) => {
  try {
    const {
      titulo,
      autor,
      caracteristicas,
      genero,
      enlaceImg,
      enlace_pdf,
      estado,
    } = req.body;
    await pool.query(
      `SELECT insertar_libro(
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7
    );`,
      [titulo, autor, caracteristicas, genero, enlaceImg, enlace_pdf, estado]
    );
    res.status(201).json({ mensaje: "Libro agregado con éxito" });
  } catch (error) {
    console.error("Error al agregar el libro:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//recibe el nombre de la imagen que se guarda en la API app.js
app.post("/actualizar-enlace-img", async (req, res) => {
  try {
    const { idLibroSeleccionado, generatedFileName } = req.body;
    await pool.query("SELECT actualizar_enlace_img($1, $2)", [
      idLibroSeleccionado,
      generatedFileName,
    ]);
    res.status(200).json({ mensaje: "Campo enlace_img actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar el campo enlace_img:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//obtiene los libros
app.get("/libros", Authapp, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id_libro, 
        titulo, 
        autor_car.autor AS autor, 
        autor_car.caracteristicas AS caracteristicas, 
        genero, 
        enlace_img, 
        enlace_pdf, 
        estado 
      FROM libros
      CROSS JOIN LATERAL UNNEST(array[datos_autor_caracteristicas]) AS autor_car
    `);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener los libros:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
//obtiene los datos para ver la tabla con imagenes
app.get("/libros-img", Authapp, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id_libro, titulo, genero, estado, enlace_img FROM libros"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener los libros:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//put para actualizar los datos de la tabla libros
app.put("/actualizar-libro/:id", Authapp, async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, autor, caracteristicas, genero, estado } = req.body;

    const result = await pool.query(
      `UPDATE libros
       SET titulo = $1, datos_autor_caracteristicas = ($2, $3), genero = $4, estado = $5
       WHERE id_libro = $6`,
      [titulo, autor, caracteristicas, genero, estado, id]
    );

    if (result.rowCount === 1) {
      res.status(200).json({ mensaje: "Libro actualizado con éxito" });
    } else {
      res.status(404).json({ error: "Libro no encontrado" });
    }
  } catch (error) {
    console.error("Error al actualizar el libro:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
//elimina un libro de la tabla libros

app.delete("/eliminar-libro/:id", Authapp, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM libros WHERE id_libro = $1", [
      id,
    ]);

    if (result.rowCount === 1) {
      res.status(200).json({ mensaje: "Libro eliminado con éxito" });
    } else {
      res.status(404).json({ error: "Libro no encontrado" });
    }
  } catch (error) {
    console.error("Error al eliminar el libro:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
