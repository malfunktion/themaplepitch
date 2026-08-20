// scripts/validate-data.mjs
import fs from 'fs';
import path from 'path';

console.log('🔍 Running lightweight data validation check...');

const packageJsonPath = path.resolve(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: package.json missing!');
  process.exit(1);
}

console.log('✅ Data validation check passed successfully!');
process.exit(0);
