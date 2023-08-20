const fs = require('fs');
const path = require('path');

async function requireAll(directory) {
  const files = fs.readdirSync(directory);

  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      requireAll(filePath);
    } else if (path.extname(file) === '.js') {
      require(filePath);
    }
  });
}

module.exports = requireAll;