const http = require('http');
const fs = require('fs');
const path = require('path');

const memes = [
  { name: "Distracted Boyfriend", image: "https://i.kym-cdn.com/photos/images/original/001/287/995/389.jpg" },
  { name: "Drake Hotline Bling", image: "https://i.kym-cdn.com/photos/images/original/001/026/318/0d6.jpg" },
  { name: "Success Kid", image: "https://i.kym-cdn.com/photos/images/original/000/001/384/success-kid.jpg" },
  { name: "Grumpy Cat", image: "https://i.kym-cdn.com/photos/images/original/000/381/389/0f7.jpg" },
  { name: "Pepe the Frog", image: "https://i.kym-cdn.com/photos/images/original/000/975/079/717.png" },
  { name: "Woman Yelling at a Cat", image: "https://i.kym-cdn.com/photos/images/original/001/671/914/5e7.jpg" },
  { name: "SpongeBob Mocking", image: "https://i.kym-cdn.com/photos/images/original/001/389/816/33f.jpg" },
  { name: "Expanding Brain", image: "https://i.kym-cdn.com/photos/images/original/001/235/772/2e8.jpg" },
  { name: "Change My Mind", image: "https://i.kym-cdn.com/photos/images/original/001/431/201/728.jpg" },
  { name: "One Does Not Simply Walk Into Mordor", image: "https://i.kym-cdn.com/photos/images/original/000/198/763/One_Does_Not_Simply_Walk_Into_Mordor.jpg" },
  { name: "Disaster Girl", image: "https://i.kym-cdn.com/photos/images/original/000/095/317/Disaster-Girl-Meme.jpg" },
  { name: "Bad Luck Brian", image: "https://i.kym-cdn.com/photos/images/original/000/293/590/6f6.jpg" },
  { name: "Trollface", image: "https://i.kym-cdn.com/photos/images/original/000/000/149/Whynotroll.jpg" },
  { name: "Doge", image: "https://i.kym-cdn.com/photos/images/original/000/581/296/c09.jpg" },
  { name: "Is This a Pigeon?", image: "https://i.kym-cdn.com/photos/images/original/001/380/193/23e.jpg" },
  { name: "Surprised Pikachu", image: "https://i.kym-cdn.com/photos/images/original/001/429/976/c1e.jpg" },
  { name: "Hide the Pain Harold", image: "https://i.kym-cdn.com/photos/images/original/000/879/077/587.jpg" },
  { name: "Salt Bae", image: "https://i.kym-cdn.com/photos/images/original/001/325/779/5a8.jpg" },
  { name: "Kermit the Frog (But That’s None of My Business)", image: "https://i.kym-cdn.com/photos/images/original/000/974/691/0b8.jpg" },
  { name: "Rickroll", image: "https://i.kym-cdn.com/photos/images/original/000/144/829/1281762387718.jpg" },
  { name: "Scumbag Steve", image: "https://i.kym-cdn.com/photos/images/original/000/077/077/Scumbag_Steve.jpg" },
  { name: "Overly Attached Girlfriend", image: "https://i.kym-cdn.com/photos/images/original/000/298/392/7fc.jpg" },
  { name: "Yo Dawg", image: "https://i.kym-cdn.com/photos/images/original/000/075/489/Yo_Dawg.jpg" },
  { name: "Ermahgerd", image: "https://i.kym-cdn.com/photos/images/original/000/306/977/4b3.jpg" },
  { name: "First World Problems", image: "https://i.kym-cdn.com/photos/images/original/000/215/672/First_World_Problems.jpg" },
  { name: "Philosoraptor", image: "https://i.kym-cdn.com/photos/images/original/000/027/217/Philosoraptor.jpg" },
  { name: "Arthur Fist", image: "https://i.kym-cdn.com/photos/images/original/001/291/461/8e8.jpg" },
  { name: "This Is Fine", image: "https://i.kym-cdn.com/photos/images/original/001/026/152/88a.jpg" },
  { name: "Distracted Cat", image: "https://i.kym-cdn.com/photos/images/original/001/671/914/5e7.jpg" },
  { name: "Galaxy Brain", image: "https://i.kym-cdn.com/photos/images/original/001/235/772/2e8.jpg" }
];

let stack = 0;
let round = 0;
let poems = [];

function scorePoem(poem, meme) {
  const lines = poem.split('\n').filter(line => line.trim());
  
  let concisenessScore = 0;
  if (lines.length === 2) concisenessScore += 2;
  const wordCounts = lines.map(line => line.split(' ').length);
  if (wordCounts.every(count => count <= 10)) concisenessScore += 1;
  
  let originalityScore = 3; // Simplified
  
  let rhymeScore = 0;
  if (lines.length === 2) {
    const lastWords = lines.map(line => line.trim().split(' ').pop().toLowerCase());
    if (lastWords[0].slice(-2) === lastWords[1].slice(-2)) rhymeScore += 3;
    else if (lastWords[0].slice(-1) === lastWords[1].slice(-1)) rhymeScore += 1;
  }
  
  let memeIntegrationScore = 0;
  if (poem.toLowerCase().includes(meme.toLowerCase())) memeIntegrationScore += 3;
  else if (poem.toLowerCase().includes(meme.split(' ')[0].toLowerCase())) memeIntegrationScore += 1;
  
  const totalScore = concisenessScore + originalityScore + rhymeScore + memeIntegrationScore;
  const missedPoints = 12 - totalScore;
  return { score: totalScore, missedPoints };
}

const server = http.createServer((req, res) => {
  const url = req.url === '/' ? '/index.html' : req.url;
  const method = req.method;

  if (method === 'GET' && url === '/start') {
    stack = 0;
    round = 0;
    poems = [];
    const meme = memes[Math.floor(Math.random() * memes.length)];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ meme: meme.name, image: meme.image }));
  } else if (method === 'POST' && url === '/submit') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { poem, meme } = JSON.parse(body);
      const result = scorePoem(poem, meme);
      stack += result.missedPoints;
      poems.push(poem);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ score: result.score, missedPoints: result.missedPoints, stack }));
    });
  } else if (method === 'GET' && url === '/next') {
    round++;
    if (round >= 10 || stack >= 50) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ gameOver: true }));
    } else {
      const meme = memes[Math.floor(Math.random() * memes.length)];
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ meme: meme.name, image: meme.image }));
    }
  } else if (method === 'GET' && url === '/score-check') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ stack }));
  } else if (method === 'GET' && url === '/end') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ poems }));
  } else {
    const filePath = path.join(__dirname, url);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not Found');
        return;
      }
      const ext = path.extname(filePath);
      const contentType = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript'
      }[ext] || 'text/plain';
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  }
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});