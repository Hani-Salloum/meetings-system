const fs = require('fs');
const path = require('path');

// Schema file paths
const schemaDir = path.join(__dirname, 'schema');
const outputFile = path.join(__dirname, 'schema.prisma');

// Files to combine in order
const schemaFiles = [
  'enums.prisma',
  'client.prisma', 
  'employee.prisma',
  'project.prisma',
  'meeting.prisma'
];

// Header content
const header = `generator client {
  provider        = "prisma-client-js"
  previewFeatures = []
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

`;

// Combine all schema files
let combinedSchema = header;

schemaFiles.forEach(file => {
  const filePath = path.join(schemaDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    combinedSchema += `\n// ========================================\n`;
    combinedSchema += `// ${file.toUpperCase().replace('.prisma', '')}\n`;
    combinedSchema += `// ========================================\n\n`;
    combinedSchema += content;
    combinedSchema += `\n`;
  } else {
    console.warn(`Warning: ${file} not found`);
  }
});

// Write combined schema
fs.writeFileSync(outputFile, combinedSchema, 'utf8');
console.log(`✅ Schema built successfully: ${outputFile}`);
console.log(`📁 Combined ${schemaFiles.length} schema files`);
