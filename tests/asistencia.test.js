
const { calcularAsistencia } = require("../src/asistencia");

describe("Calculo de asistencia", () => {
  test("aprueba una asistencia del 80%", () => {
    expect(calcularAsistencia(8, 10)).toEqual({
      porcentaje: 80,
      cumple: true
    });
  });

  test("rechaza una asistencia del 60%", () => {
    expect(calcularAsistencia(6, 10)).toEqual({
      porcentaje: 60,
      cumple: false
    });
  });

  test("acepta exactamente el minimo del 75%", () => {
    expect(calcularAsistencia(3, 4).cumple).toBe(true);
  });

  test("rechaza una cantidad no entera", () => {
    expect(calcularAsistencia(2.5, 10)).toBeNull();
  });

  test("rechaza un total no entero", () => {
    expect(calcularAsistencia(2, 5.5)).toBeNull();
  });

  test("rechaza un total igual a cero", () => {
    expect(calcularAsistencia(0, 0)).toBeNull();
  });

  test("rechaza cantidades negativas", () => {
    expect(calcularAsistencia(-1, 10)).toBeNull();
  });

  test("rechaza una asistencia superior al total", () => {
    expect(calcularAsistencia(11, 10)).toBeNull();
  });
});
