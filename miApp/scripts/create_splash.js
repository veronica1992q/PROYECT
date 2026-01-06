const fs = require('fs');
const path = require('path');

const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=';
const outPath = path.join(__dirname, '..', 'assets', 'splash.png');

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, Buffer.from(base64, 'base64'));
console.log('Created:', outPath);