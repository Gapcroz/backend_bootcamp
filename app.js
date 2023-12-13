// LIBRERIAS
const express = require("express"); // sirve para usar un puerto donde nuestras aplicaciones la puedan consumir.
const cors = require("cors"); // Sirve para las reglas
const bodyParser = require("body-parser");
const db = require("./db");
const User = require("./models/users");

const app = express();
app.use(express.json({ limit: "50mb" }));
app.unsubscribe(express.static(`${__dirname}/public`));

// app.set("jwtkey", process.env.JWT_KEY);
app.use(cors());
app.use(bodyParser.json());
app.all("*", function (req, res, next) {
  res.header("Acces-Control-Allow-Origin", "*"); // permitirá el acceso de cualquier servidor que quiera ingresar a nuestro sitio web.
  res.header(
    "Acces-Control-Allow-Methods",
    "PUT, GET, POST, DELETE, PATCH, OPTIONS"
  ); // las opciones que permitiremos manejar.
  res.header(
    "Acces-Control-Allow-Headers",
    "Origin",
    "X-Api-Key",
    "x-requested-With",
    "Content-Type",
    "Accept",
    "Authorization"
  ); // son los cabeceros para comunicarse con autorizaciones.
  next();
});

app.get("/myapi/username/:name/:lastname", function (req, res) {
  let name = req.params.name;
  let lastname = req.params.lastname;
  res.send("Bienvenido a Waru " + name + " " + lastname);
});
app.post("/api/login/", function (req, res) {
  let passwordCorrecto = "qwerty12345#";
  let passwordRecibido = req.body.password; // password será el texto en json que tiene que agregarse al software postman // EN BODY Y PASSWORD SE VA A ALMACENAR LA INFO
  if (passwordRecibido === passwordCorrecto) {
    res.send({
      success: true,
      msg: "LogIn correcto",
    });
  } else {
    res.send({
      success: false,
      msg: "LogIn incorrecto",
    });
  }
});
app.get("/myapi/saludo", function (req, res) {
  res.send("Bienvenido a Waru web");
});
app.get("/api/hello", function (req, res) {
  res.send("inicio pruebas REST");
});
// Clase para guardar bases de datos en MongoDB - USERS
// primero crear la variable con sus requerimientos
const createUser = async (req, res) => {
  const { _username, _mail, _password, _role, _domicilio, _telefono } =
    req.body;
  // señalar si existe el valor mail
  try {
    const mailexists = await User.exists({ mail: _mail });
    if (mailexists) {
      return res.status(400).json({
        msg: "El correo ya existe",
      });
      // si no está debe agregar todos los nuevos valores
    } else {
      const newUser = new User({
        username: _username,
        mail: _mail,
        password: _password,
        role: _role,
        domicilio: _domicilio,
        telefono: _telefono,
      });
      // ahora se debe guardar los valores en una nueva variable.
      const createdUser = await newUser.save();
      return res.status(201).json({
        msg: "Usuario creado",
        user: createdUser._id,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

app.get("/api/getusers", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/newuser", function (req, res) {
  createUser(req, res);
});

db.connect();
const port = 3001;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
