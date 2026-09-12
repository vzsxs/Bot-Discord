require("dotenv").config();
require("./server");

const axios = require("axios");
const { Client, GatewayIntentBits, Events } = require("discord.js");

console.log("🟣 Node:", process.version);
console.log("🟣 Discord.js:", require("discord.js").version);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// ===============================
// DIAGNÓSTICO DE DISCORD
// ===============================

client.on("debug", (info) => {
  console.log("🔍 DISCORD DEBUG:", info);
});

client.on("error", (error) => {
  console.error("🚨 DISCORD CLIENT ERROR:", error);
});

client.on("warn", (info) => {
  console.warn("⚠️ DISCORD WARN:", info);
});

// ===============================
// PRIORIDAD DE ROLES
// ===============================

const ROLE_PRIORITY = [
  "Fuhrer",
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

  "SA-Chef der Stabes",
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
  "SA-Mann",

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
  "Hitlerjunge",

  "Generalfeldmarschall",
  "Generalleutnant",
  "Generaloberst",
  "Obergefreiter",
  "Generalmajor",
  "Oberst",
  "Oberstleutnant",
  "Major",
  "Hauptmann",
  "Oberleutnant",
  "Leutnant",
  "Oberfeldwebel",
  "Stabsfeldwebel",
  "Feldwebel",
  "Unterfeldwebel",
  "Unteroffizier",
  "Stabsgefreiter"
];

// ===============================
// OBTENER ROL
// ===============================

function getExactRoleTag(member) {
  const userRoles = member.roles.cache.map(r =>
    r.name.toLowerCase().trim()
  );

  for (const roleName of ROLE_PRIORITY) {
    if (userRoles.includes(roleName.toLowerCase().trim())) {
      return roleName;
    }
  }

  return "Civil";
}

// ===============================
// BOT READY
// ===============================

client.once(Events.ClientReady, () => {
  console.log("🤖 Bot encendido");
  console.log(`👤 Conectado como: ${client.user.tag}`);
  console.log(`🌐 Servidores: ${client.guilds.cache.size}`);
});

// ===============================
// COMANDO /LINK
// ===============================

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName !== "link") return;

    // Evita Unknown interaction
    await interaction.deferReply({
      ephemeral: false
    });

    const robloxUserId =
      interaction.options.getString("roblox_userid");

    const robloxUsername =
      interaction.options.getString("roblox_username");

    if (!robloxUserId || !robloxUsername) {
      return interaction.editReply(
        "❌ Faltan datos en /link"
      );
    }

    const roleTag = getExactRoleTag(interaction.member);

    const discordName =
      interaction.member.displayName;

    await axios.post(
      `${process.env.API_BASE_URL}/profile`,
      {
        robloxUserId,
        robloxUsername,
        discordName,
        roleTag
      }
    );

    await interaction.editReply(
      `✅ Vinculado correctamente
👤 Roblox: ${robloxUsername}
💬 Discord: ${discordName}
🎖️ Rol: ${roleTag}`
    );

  } catch (err) {
    console.error("ERROR BOT:", err);

    try {
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply(
          "❌ Error conectando con la API"
        );
      } else {
        await interaction.reply(
          "❌ Error conectando con la API"
        );
      }
    } catch (e) {
      console.error(
        "Fallo al responder error:",
        e
      );
    }
  }
});

// ===============================
// LOGIN
// ===============================

console.log("🔥 LLEGANDO AL LOGIN");

console.log(
  "🔑 TOKEN EXISTE:",
  !!process.env.DISCORD_TOKEN
);

console.log(
  "📏 LONGITUD TOKEN:",
  process.env.DISCORD_TOKEN?.length
);

client.login(process.env.DISCORD_TOKEN)
  .then(() => {
    console.log("✅ BOT CONECTADO A DISCORD");
  })
  .catch((err) => {
    console.error("❌ ERROR DE LOGIN:", err);
  });
