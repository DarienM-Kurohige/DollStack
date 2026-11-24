
function calcularAsistencia(presentes, total) {
  if (!Number.isInteger(presentes) || !Number.isInteger(total)) {
    return null;
  }

  if (total <= 0 || presentes < 0 || presentes > total) {
    return null;
  }

  const porcentaje = (presentes / total) * 100;

  return {
    porcentaje: Number(porcentaje.toFixed(2)),
    cumple: porcentaje >= 75
  };
}

module.exports = { calcularAsistencia };
