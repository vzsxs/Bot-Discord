require("dotenv").config();
const axios = require("axios");
const { Client, GatewayIntentBits, Events } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const ROLE_PRIORITY = [
  "Reichsführer-SS",
  "OberstGruppenführer",
  "Obergruppenführer",
  "Gruppenführer",
  "Brigadeführer",
  "Oberführer",
  "Standartenführer",
  "Obersturmbannführer",
  "Sturmbannführer",
  "Hauptsturmführer",
  "Obersturmführer",
  "Untersturmführer",
  "Sturmscharführer",
  "Hauptscharführer",
  "Oberscharführer",
  "Scharführer",
  "Unterscharführer",
  "Rottenführer",
  "Sturmmann",
  "Oberschütze",
  "Mann",
  "Anwärter",
  "Bewerber",

  "SD-Oberst-Gruppenführer",
  "SD-Obergruppenführer",
  "SD-Gruppenführer",
  "SD-Brigadeführer",
  "SD-Oberführer",
  "SD-Standartenführer",
  "SD-Obersturmbannführer",
  "SD-Sturmbannführer",
  "SD-Hauptsturmführer",
  "SD-Obersturmführer",
  "SD-Untersturmführer",
  "SD-Sturmscharführer",
  "SD-Hauptscharführer",
  "SD-Oberscharführer",
  "SD-Scharführer",
  "SD-Unterscharführer",
  "SD-Rottenführer",
  "SD-Sturmmann",
  "SD-Mann",

  "SA-Stabschef",
  "SA-Obergruppenführer",
  "SA-Gruppenführer",
  "SA-Brigadeführer",
  "SA-Oberführer",
  "SA-Standartenführer",
  "SA-Obersturmbannführer",
  "SA-Sturmbannführer",
  "SA-Obersturmführer",
  "SA-Sturmführer",
  "SA-Haupttruppführer",
  "SA-Obertruppführer",
  "SA-Truppführer",
  "SA-Oberscharführer",
  "SA-Scharführer",
  "SA-Rottenführer",
  "SA-Obersturmmann",

  "Reichsleiter",
  "Gauleiter",
  "Hauptbefehlsleiter",
  "Oberbefehlsleiter",
  "Befehlsleiter",
  "Hauptdienstleiter",
  "Oberdienstleiter",
  "Dienstleiter",
  "Hauptbereichsleiter",
  "Oberbereichsleiter",
  "Bereichsleiter",
  "Hauptabschnittsleiter",
  "Oberabschnittsleiter",
  "Abschnittsleiter",
  "Hauptgemeinschaftsleiter",
  "Obergemeinschaftsleiter",
  "Gemeinschaftsleiter",

  "Rottenführer",
  "Oberrottenführer",
  "Kameradschaftsführer",
  "Oberkameradschaftsführer",
  "Scharführer",
  "Gefolgschaftsführer",
  "Obergefolgschaftsführer",
  "Hauptgefolgschaftsführer",
  "Stammführer",
  "Oberstammführer",
  "Bannführer",
  "Oberbannführer",
  "Gebietsführer",
  "Obergebietsführer",
  "Reichsjugendführer",
  "Hitlerjunge"
];

function getExactRoleTag(member) {
  for (const roleName of ROLE_PRIORITY) {
    const found = member.roles.cache.some(role => role.name === roleName);
    if (found) return roleName;
  }
  return "Civil";
}

client.once(Events.ClientReady, () => {
  console.log("🤖 Bot encendido");
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName !== "link") return;

    const robloxUserId = interaction.options.getString("roblox_userid");
    const robloxUsername = interaction.options.getString("roblox_username");

    if (!robloxUserId || !robloxUsername) {
      return interaction.reply("❌ Faltan datos en /link");
    }

    const roleTag = getExactRoleTag(interaction.member);
    const discordName = interaction.member.displayName; // nombre visible en el server

    await axios.post(`${process.env.API_BASE_URL}/profile`, {
      robloxUserId,
      robloxUsername,
      discordName,
      roleTag
    });

    await interaction.reply(
      `✅ Vinculado correctamente\n👤 Roblox: ${robloxUsername}\n💬 Discord: ${discordName}\n🎖️ ${roleTag}`
    );
  } catch (err) {
    console.error("ERROR BOT:", err);
    if (!interaction.replied) {
      await interaction.reply("❌ Error conectando con la API");
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
