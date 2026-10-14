const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname)); // HTML serve karega

// Form submit hoga yaha
app.post('/submit', (req, res) => {
  let students = [];
  if (fs.existsSync('students.json')) {
    students = JSON.parse(fs.readFileSync('students.json'));
  }
  students.push({...req.body, date: new Date().toLocaleString()});
  fs.writeFileSync('students.json', JSON.stringify(students, null, 2));
  
  res.send(`<h1>Form Submitted!</h1><p>Thanks ${req.body.firstname}</p><a href="/">Go Back</a> | <a href="/students.json">View All Data</a>`);
});

// Server start
app.listen(PORT, () => {
  console.log(`Server chal raha hai: http://localhost:${PORT}`);
});