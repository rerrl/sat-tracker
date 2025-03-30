const fs = require("fs");
const path = require("path");

function bumpVersion(version) {
  // Update package.json
  const packagePath = path.join(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  packageJson.version = version;
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');

  // Update index.html
  const indexPath = path.join(__dirname, '../index.html');
  let indexHtml = fs.readFileSync(indexPath, 'utf8');
  indexHtml = indexHtml.replace(
    /<title>Sat Tracker ⚡️ - [\d.]+<\/title>/,
    `<title>Sat Tracker ⚡️ - ${version}</title>`
  );
  fs.writeFileSync(indexPath, indexHtml);

  console.log(`Version bumped to ${version}`);
}

const newVersion = process.argv[2];
if (!newVersion) {
  console.error('Please provide a version number');
  process.exit(1);
}

bumpVersion(newVersion);
