const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "El nombre de usuario es obligatorio"],
  },
  mail: {
    type: String,
    required: [true, "El mail es obligatorio"],
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  domicilio: {
    type: String,
    required: [false, "El domicilio es requerido"],
  },
  telefono: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
