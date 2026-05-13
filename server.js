const express = require("express");
const fs = require("node:fs");
const path = require("node:path");

const app = express();
app.use(express.json());

const PORT = 3000;
const DB_FILE = path.join(__dirname, "database.json");

let database = {};

// Cargar base de datos desde archivo
function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, "utf8");
      database = raw ? JSON.parse(raw) : {};
      console.log("✅ Base cargada desde database.json");
    } else {
      database = {};
      console.log("🆕 database.json no existe, creando base vacía");
    }
  } catch (err) {
    console.error("❌ Error cargando base de datos:", err);
    database = {};
  }
}

// Guardar base de datos al archivo
function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(database, null, 2), "utf8");
  } catch (err) {
    console.error("❌ Error guardando base de datos:", err);
  }
}

loadDatabase();

// Guardar perfil desde Discord
app.post("/profile", (req, res) => {
  const { robloxUserId, robloxUsername, roleTag } = req.body;

  if (!robloxUserId) {
    return res.status(400).json({ ok: false, error: "missing robloxUserId" });
  }

  database[String(robloxUserId)] = {
    robloxUserId: String(robloxUserId),
    robloxUsername: robloxUsername || "",
    roleTag: roleTag || "Civil"
  };

  saveDatabase();

  console.log("💾 Guardado:", database[String(robloxUserId)]);

  res.json({
    ok: true,
    profile: database[String(robloxUserId)]
  });
});

// Leer perfil desde Roblox
app.get("/profile/:robloxUserId", (req, res) => {
  const user = database[String(req.params.robloxUserId)];

  if (!user) {
    return res.json({ ok: false });
  }

  res.json({
    ok: true,
    profile: user
  });
});

app.listen(PORT, () => {
  console.log(`🚀 API lista en http://localhost:${PORT}`);
});