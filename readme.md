# CSV Parser Project

A Node.js application that processes attendance CSV files and generates a formatted output with mapped names and priorities.

## Features

- Reads multiple CSV files from the `Attendeces` directory
- Extracts specific fields (GRNO, date, time, entry)
- Maps GRNO to names using a predefined data object
- Sorts results based on priority
- Generates a formatted output file

## Project Structure

```
csv-parser-project/
├── Attendeces/        # Directory for CSV files
├── index.js          # Main application file
├── package.json      # Project dependencies
├── README.md         # Documentation
└── output.txt        # Generated output file
```

## CSV File Format

The input CSV files should have the following columns in order:
- ID
- GRNO
- date
- Time
- Entry
- Deviceid
- zero
- one

## Setup and Usage

1. Install dependencies:
   ```bash
   npm install
   ```

2. Place your CSV files in the `Attendeces` directory

3. Update the `dataObject` in `index.js` with your GRNO to name mappings:
   ```javascript
   const dataObject = {
       'GR001': { name: 'John Doe', priority: 1 },
       'GR002': { name: 'Jane Smith', priority: 2 }
   };
   ```

4. Run the application:
   ```bash
   npm start
   ```

5. Check `output.txt` for the results in the format:
   ```
   GRNO, name, date, time, entry, priority
   ```

## Error Handling

The application includes error handling for:
- Missing Attendeces directory (creates if not exists)
- No CSV files in the directory
- CSV file reading errors
- Invalid data format
