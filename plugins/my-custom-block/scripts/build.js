const { execSync } = require("child_process");
require("dotenv").config();

const command = process.argv[2]; // "start" or "build"
const outputPath = process.env.PLUGIN_PATH;

const outputFlag = outputPath ? `--output-path=${outputPath}` : "";

execSync(
  `wp-scripts ${command} --experimental-modules ${outputFlag}`,
  { stdio: "inherit" }
);