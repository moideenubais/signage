const bcrypt = require("bcrypt");
async function temp() {
  const salt = await bcrypt.genSalt(10);
  console.log(await bcrypt.hash("Ubais@1234", salt));
}
temp();
