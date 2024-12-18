const newCSVTargetPath = './books.csv';
const modifyjson = require('./modifyjson');
const jsonToCSV = require('./jsonToCSV');

const filePath = './books.json';

async function processFiles() {
    try {
        // Update JSON data
        const updatedData = await modifyjson.updatejsonData(filePath);
        console.log('JSON  updated successfully!');

        const defaultKeys = [
            '@id',
            'author',
            'title',
            'genre',
            'price',
            'publish_date',
            'description'
          ]
        // Convert JSON to desired filetype
        await jsonToCSV(updatedData, newCSVTargetPath, defaultKeys);
        console.log('CSV file written successfully!');

    } catch (err) {
        console.error('Error during file processing:', err);
    }
}

processFiles();
