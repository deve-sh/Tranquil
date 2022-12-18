const { spawnSync } = require("child_process");

const killProcess = (processId) => spawnSync("kill", [processId.toString()]);

module.exports = killProcess;
