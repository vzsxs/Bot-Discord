const WebSocket = require("ws");

console.log("🧪 Probando conexión con Discord Gateway...");
console.log("🌐 Node:", process.version);

const ws = new WebSocket("wss://gateway.discord.gg/?v=10&encoding=json");

ws.on("open", () => {
  console.log("✅ CONEXIÓN AL GATEWAY EXITOSA");
  ws.close();
  process.exit(0);
});

ws.on("error", (err) => {
  console.error("❌ ERROR DE CONEXIÓN:");
  console.error(err);
  process.exit(1);
});

ws.on("close", (code, reason) => {
  console.log("🔌 WebSocket cerrado:", code, reason.toString());
});

setTimeout(() => {
  console.log("⏰ TIMEOUT: no se pudo conectar en 15 segundos");
  process.exit(1);
}, 15000);
