const fs = require("fs");
const path = require("path");

// Setup global client & api
global.client = {
  commands: new Map(),
  events: new Map()
};

// ==== LOAD COMMANDS ====

const commandPath = path.join(__dirname, "Script", "commands");
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  try {
    const command = require(path.join(commandPath, file));
    if (command.config?.name) {
      global.client.commands.set(command.config.name, command);
      console.log(`✅ Loaded command: ${command.config.name}`);
    }
  } catch (err) {
    console.error(`❌ Error loading command ${file}:`, err);
  }
}

// ==== MESSAGE HANDLER ====

const login = require("./includes/login");

login(async (api) => {
  api.listenMqtt(async (event) => {
    if (!event.body || event.body.startsWith("system:")) return;

    const [cmdName, ...args] = event.body.trim().split(/\s+/);
    const command = global.client.commands.get(cmdName?.toLowerCase());

    if (command && typeof command.onStart === "function") {
      try {
        await command.onStart({
          api,
          event,
          args
        });
      } catch (err) {
        api.sendMessage(`❌ কমান্ড চালাতে সমস্যা হয়েছে!\n\n${err.message}`, event.threadID);
      }
    }
  });
});
