/**
 * Build for cPanel deployment into the "britline" subfolder.
 * Sets PATH_PREFIX=/britline/ so all asset and link URLs work.
 * After running, upload the contents of _site/ to your cPanel "britline" folder
 * (e.g. public_html/britline or subdomain root).
 */

const { execSync } = require("child_process");
const path = require("path");

const pathPrefix = "/britline/";

console.log("Building for cPanel (pathPrefix: " + pathPrefix + ")...\n");

const env = { ...process.env, PATH_PREFIX: pathPrefix };

try {
  execSync("npm run build", {
    stdio: "inherit",
    env,
    cwd: path.resolve(__dirname, ".."),
  });
  console.log("\nBuild complete.");
  console.log("Upload the contents of the _site folder to your cPanel 'britline' folder");
  console.log("(e.g. public_html/britline or your subdomain document root).\n");
} catch (err) {
  process.exit(err.status || 1);
}
