const http = require('http');
const fs = require('fs');
const qs = require('querystring');
const path = require('path');

const PORT = 3000;

const server = http.createServer((req, res) => {

  // 1. Form dikhana (GET /)
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    let html = fs.readFileSync('index.html', 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(html);
  }

  // 2. students.json dikhana
  if (req.method === 'GET' && req.url === '/students.json') {
    if (!fs.existsSync('students.json')) {
      fs.writeFileSync('students.json', '[]');
    }
    let data = fs.readFileSync('students.json', 'utf8');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(data);
  }

  // 3. Form Submit (POST /submit)
  if (req.method === 'POST' && req.url === '/submit') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      let formData = qs.parse(body);

      let students = [];
      if (fs.existsSync('students.json')) {
        students = JSON.parse(fs.readFileSync('students.json', 'utf8'));
      }
      formData.date = new Date().toLocaleString();
      students.push(formData);

      fs.writeFileSync('students.json', JSON.stringify(students, null, 2));

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
        <body style="font-family:sans-serif;text-align:center;padding:50px">
          <h1>✅ Form Submitted!</h1>
          <p>Thanks ${formData.first_name || 'Student'}</p>
          <a href="/">Go Back</a> &nbsp; | &nbsp;
          <a href="/students.json">View All Data</a>
        </body>
      `);
    });
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`Server chal raha hai: http://localhost:${PORT}`);
});