// deploy-commands.js
require("dotenv").config();
const { REST, Routes, SlashCommandBuilder } = require("discord.js");

console.log("🚀 Iniciando deploy de comandos...");

const commands = [
  new SlashCommandBuilder()
    .setName("link")
    .setDescription("Vincular cuenta Roblox con Discord")
    .addStringOption(option =>
      option
        .setName("roblox_userid")
        .setDescription("Tu Roblox UserId")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("roblox_username")
        .setDescription("Tu nombre de Roblox")
        .setRequired(true)
    )
    .toJSON()
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("📡 Enviando comandos a Discord...");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log("✅ Comando /link registrado correctamente");
  } catch (error) {
    console.error("❌ ERROR DEPLOY:", error);
  }
})();