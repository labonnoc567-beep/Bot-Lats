const fs = require("fs");
const path = require("path");
const login = require("./includes/login");

global.client = {
  commands: new Map(),
};

// Load all commands from Script/commands
const commandFolder = path.join(__dirname, "Script", "commands");
fs.readdirSync(commandFolder).forEach(file => {
  if (file.endsWith(".js")) {
    try {
      const command = require(path.join(commandFolder, file));
      if (command.config && command.config.name) {
        global.client.commands.set(command.config.name.toLowerCase(), command);
        console.log(`✅ Loaded: ${command.config.name}`);
      }
    } catch (err) {
      console.error(`❌ Failed to load ${file}:`, err);
    }
  }
});

login(async (api) => {
  console.log("✅ Logged in successfully!");

  api.listenMqtt(async (event) => {
    if (!event.body || !event.body.startsWith(".")) return;

    const [cmdName, ...args] = event.body.slice(1).split(/\s+/);
    const command = global.client.commands.get(cmdName.toLowerCase());

    if (command && typeof command.onStart === "function") {
      try {
        await command.onStart({
          api,
          event,
          args
        });
      } catch (err) {
        console.error(`❌ Error in command '${cmdName}':`, err);
        api.sendMessage(`⚠️ কমান্ড চালাতে সমস্যা হয়েছে:\n${err.message}`, event.threadID);
      }
    }
  });
});
