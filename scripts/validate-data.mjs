import fs from 'node:fs';
const required = ['src/lib/models.ts','src/lib/data/demo.ts','src/lib/services/entities.ts'];
const missing = required.filter(file=>!fs.existsSync(file));
if(missing.length){console.error('Missing required data-layer files:',missing);process.exit(1)}
console.log('Maple Pitch data layer: OK');
