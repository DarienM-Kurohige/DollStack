
const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`EduTech Labs ejecutandose en puerto ${PORT}`);
});
