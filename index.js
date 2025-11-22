const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

/**
 * Sample data object mapping GRNO to Names and their priorities
 * Replace this with your actual data
 */
const dataObject = {
    G01031: { name: 'Kamlesh Mulchandani', priority: 1 },
    G02935: { name: 'Mukesh Pancholi', priority: 2 },
    G03012: { name: 'Lalit Jamtani', priority: 3 },
    G02746: { name: 'Punitkumar Tewani', priority: 4 },
    G00132: { name: 'Asharam Yadav', priority: 5 },
    G00523: { name: 'Dinesh Dudhat', priority: 6 },
    G00669: { name: 'Harsh Harwani', priority: 7 },
    G01245: { name: 'Laxman Ramchandani', priority: 8 },
    L02517: { name: 'Tanisha Dhanwani', priority: 9 },
    G00359: { name: 'Chirag Chauhan', priority: 10 },
    G01148: { name: 'Kirtan Patel', priority: 11 },
    G00402: { name: 'Deepak Khemani', priority: 12 },
    G02225: { name: 'Subhash Sonvane', priority: 13 },
    GN250686: { name: 'Anita Rathod', priority: 14 },
    G01908: { name: 'Rajnish Yadav', priority: 15 },
    G00249: { name: 'Bharat Luhana', priority: 16 },
    G01527: { name: 'Naresh Bhambhani', priority: 17 },
    L01730: { name: 'Renu Rajput', priority: 18 },
    L00134: { name: 'Beena Rana', priority: 19 },
    L02956: { name: 'Anjali Gidwani', priority: 20 },
    G01887: { name: 'Rajesh Tewani', priority: 21 },
    G00912: { name: 'Jayesh Chauhan', priority: 22 },
    L02826: { name: 'Rachna Nagar', priority: 23 },
    G01070: { name: 'Kanti Patel', priority: 24 },
    G00338: { name: 'Chandubhai Dodiyar', priority: 25 },
    L02749: { name: 'Sakshi Luhana', priority: 26 },
    L00169: { name: 'Bharti Yadav', priority: 27 },
    G02029: { name: 'Ratanlal Meena', priority: 28 },
    M03787: { name: 'Rasul Goraji', priority: 29 },
    L00435: { name: 'Ganga Prajapati', priority: 30 },
    G02412: { name: 'Vijay Ramchandani', priority: 31 },
    G01043: { name: 'Kamlesh Virwani', priority: 32 },
    L01320: { name: 'Nainaben Panchal', priority: 33 },
    L00476: { name: 'Geeta Patel', priority: 34 },
    G00873: { name: 'Jaman Sainani', priority: 35 },
    G00018: { name: 'Ajay Sadhwani', priority: 36 },
    G00025: { name: 'Akash Paryani', priority: 37 },
    G01443: { name: 'Mukesh Bhagdev', priority: 38 },
    G03222: { name: 'Chirag Lalwani', priority: 39 },
    G01629: { name: 'Pankaj Malkani', priority: 40 },
    G01028: { name: 'Kamlesh Malkani', priority: 41 },
    G00866: { name: 'Jaykishan Sangtani', priority: 42 },
    G00740: { name: 'Hemant Jaisinghani', priority: 43 },
    G02298: { name: 'Suresh Gyanchandani', priority: 44 },
    G01421: { name: 'Mohan Das Sukhvani', priority: 45 },
    G01224: { name: 'Lalit Bherwani', priority: 46 },
    L02946: { name: 'Bharti Wadhwani', priority: 47 },
};

// Constant variable for date filtering
const filterDate = new Date('2025-08-31'); // You can change this date as needed

// Directory path for CSV files
const attendecesDir = path.join(__dirname, 'Attendeces');

// Array to store processed results
const results = [];

// Create Attendeces directory if it doesn't exist
if (!fs.existsSync(attendecesDir)) {
    fs.mkdirSync(attendecesDir);
    console.log('Created Attendeces directory');
}

// Read all files from the Attendeces directory
fs.readdir(attendecesDir, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    // Filter only CSV files
    const csvFiles = files.filter(file => file.endsWith('.csv'));

    if (csvFiles.length === 0) {
        console.log('No CSV files found in Attendeces directory');
        return;
    }

    // Modify CSV processing to handle headerless files
    csvFiles.forEach(file => {
        const filePath = path.join(attendecesDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');

        // If file doesn't start with expected header, prepend it
        const HEADER = 'SRNO,GRNO,date,Time,Entry,deviceId,on,off';
        if (!fileContent.startsWith(HEADER)) {
            const updatedContent = HEADER + '\n' + fileContent;
            fs.writeFileSync(filePath, updatedContent);
            console.log(`Added header to ${file}`);
        }
    });

    let filesProcessed = 0;

    // Process each CSV file
    csvFiles.forEach(file => {
        fs.createReadStream(path.join(attendecesDir, file))
            .pipe(csv())
            .on('data', (data) => {
                const { GRNO, date, Time, Entry } = data;

                // Convert input date to Date object
                const entryDate = new Date(date);

                // Only process records with matching GRNO in dataObject and exact date match
                if (dataObject[GRNO] &&
                    entryDate.toISOString().split('T')[0] === filterDate.toISOString().split('T')[0]) {
                    results.push({
                        GRNO,
                        name: dataObject[GRNO].name,
                        date,
                        time: Time,
                        entry: Entry,
                        priority: dataObject[GRNO].priority
                    });
                }
            })
            .on('end', () => {
                filesProcessed++;

                // When all files are processed
                if (filesProcessed === csvFiles.length) {
                    // Sort results based on priority
                    results.sort((a, b) => a.priority - b.priority);

                    // Format output data
                    const output = results.map(r =>
                        `${r.GRNO}, ${r.name}, ${r.date}, ${r.time}, ${r.entry}, ${r.priority}`
                    ).join('\n');

                    // Write results to output.txt
                    fs.writeFileSync('output.txt', output);
                    console.log('Results have been written to output.txt');
                }
            })
            .on('error', (err) => {
                console.error(`Error processing file ${file}:`, err);
            });
    });
});
