const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Directory containing CSV files
const attendecesDir = path.join(__dirname, 'Attendeces');

// Expected header
const HEADER = 'SRNO,GRNO,date,Time,Entry,deviceId,on,off';

// Function to add header to a CSV file
function addHeaderToCSV(filePath) {
    // Read the existing file content
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // If header is already present, skip
    if (fileContent.startsWith(HEADER)) {
        console.log(`Header already present in ${path.basename(filePath)}`);
        return;
    }

    // Prepend header to the file content
    const updatedContent = HEADER + '\n' + fileContent;
    
    // Write back to the file
    fs.writeFileSync(filePath, updatedContent);
    console.log(`Added header to ${path.basename(filePath)}`);
}

// Read all files in the Attendeces directory
const files = fs.readdirSync(attendecesDir)
    .filter(file => file.endsWith('.csv'))
    .forEach(file => {
        const filePath = path.join(attendecesDir, file);
        addHeaderToCSV(filePath);
    });

console.log('Header addition process complete.');
