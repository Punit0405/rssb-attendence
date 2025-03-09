const fs = require('fs');

// Read the output.txt file
const content = fs.readFileSync('output.txt', 'utf8');

// Split into lines
const lines = content.split('\n');

// Create a Set to store unique lines
const uniqueLines = new Set(lines);

// Convert back to array and join with newlines
const uniqueContent = Array.from(uniqueLines).join('\n');

// Write back to output.txt
fs.writeFileSync('output.txt', uniqueContent);

console.log('Duplicates removed from output.txt');
