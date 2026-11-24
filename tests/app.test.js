
const request = require("supertest");
const app = require("../src/app");

describe("API EduTech Labs", () => {
  test("responde correctamente en la ruta principal", async () => {
    const res = await request(app).get("/");

    expect(res.statusCode).toBe(200);
    expect(res.body.aplicacion).toBe("EduTech Labs");
  });

  test("el servicio se encuentra disponible", async () => {
    const res = await request(app).get("/health");

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });

  test("calcula correctamente la asistencia", async () => {
    const res = await request(app)
      .post("/api/asistencia")
      .send({ presentes: 8, total: 10 });

    expect(res.statusCode).toBe(200);
    expect(res.body.porcentaje).toBe(80);
    expect(res.body.cumple).toBe(true);
  });

  test("rechaza datos incorrectos", async () => {
    const res = await request(app)
      .post("/api/asistencia")
      .send({ presentes: 20, total: 10 });

    expect(res.statusCode).toBe(400);
  });

  test("rechaza una peticion sin datos", async () => {
    const res = await request(app)
      .post("/api/asistencia");

    expect(res.statusCode).toBe(400);
  });
});
