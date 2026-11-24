
const express = require("express");
const { calcularAsistencia } = require("./asistencia");

const app = express();

app.disable("x-powered-by");
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    aplicacion: "EduTech Labs",
    servicio: "Gestion de asistencia",
    estado: "Operativo"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok"
  });
});

app.post("/api/asistencia", (req, res) => {
  const { presentes, total } = req.body || {};
  const resultado = calcularAsistencia(presentes, total);

  if (resultado === null) {
    return res.status(400).json({
      error: "Datos de asistencia invalidos"
    });
  }

  return res.status(200).json(resultado);
});

module.exports = app;
