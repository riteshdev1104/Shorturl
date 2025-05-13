// server.js const express = require('express'); const fs = require('fs'); const path = require('path'); const bodyParser = require('body-parser'); const app = express(); const PORT = process.env.PORT || 3000;

app.use(bodyParser.json()); app.use(express.static(path.join(__dirname, 'public')));

// In-memory database (use MongoDB or other DB in production) let db = {};

// Helper to generate short code function generateCode(length = 6) { const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; let code = ''; for (let i = 0; i < length; i++) { code += chars.charAt(Math.floor(Math.random() * chars.length)); } return code; }

// Shorten URL app.post('/shorten', (req, res) => { const { longUrl, custom } = req.body; if (!longUrl) return res.json({ error: 'Long URL required' });

let short = custom || generateCode(); if (db[short]) return res.json({ error: 'Custom short URL already exists' });

db[short] = { longUrl, clicks: 0 }; res.json({ short, clicks: 0 }); });

// Redirect with timer logic app.get('/:short', (req, res) => { const short = req.params.short; const record = db[short];

if (!record) return res.status(404).send('Short URL not found');

record.clicks++; const redirectHtmlPath = path.join(__dirname, 'public', 'redirect.html'); let html = fs.readFileSync(redirectHtmlPath, 'utf8');

// Inject long URL into client-side script html = html.replace( 'const target = urlParams.get('url');', const target = "${record.longUrl}"; );

res.send(html); });

app.listen(PORT, () => console.log(Server running on port ${PORT}));

