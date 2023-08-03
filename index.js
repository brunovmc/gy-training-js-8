const express = require('express');
const fs = require('fs');
const csvParser = require('csv-parser');

const app = express();
const port = 3000;

function removeNamesStartingWithM(file) {
  const filteredData = [];

  fs.createReadStream(file)
    .pipe(csvParser({ separator: ',' }))
    .on('data', (row) => {
      const nome = row.nome;
      if (!(nome && nome[0].toUpperCase() === 'M')) {
        filteredData.push(row);
      }
    })
    .on('end', () => {
      const outputCsv = fs.createWriteStream(file);
      outputCsv.write('nome,regiao,freq,rank,sexo\n'); // Write the CSV header
      filteredData.forEach((row) => {
        outputCsv.write(`${row.nome},${row.regiao},${row.freq},${row.rank},${row.sexo}\n`);
      });
      outputCsv.end(() => {
        console.log("Names starting with 'M' have been removed from the file.");
      });
    });
}

function readAndLogData(file) {
  const names = [];

  fs.createReadStream(file)
    .pipe(csvParser({ separator: ',' }))
    .on('data', (row) => {
      names.push(row.nome);
    })
    .on('end', () => {
      console.log("Names read from the file:");
      console.log(names);
    });
}

app.get('/read-csv', (req, res) => {
  const file = 'ibge-fem-10000 (3).csv';
  readAndLogData(file)
  removeNamesStartingWithM(file);
  
  res.send("Names starting with 'M' have been removed from the file.");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
