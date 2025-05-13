const express = require("express");
const fs = require("fs");
const { nanoid } = require("nanoid");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

let urls = fs.existsSync("urls.json") ? JSON.parse(fs.readFileSync("urls.json")) : {};
let users = fs.existsSync("users.json") ? JSON.parse(fs.readFileSync("users.json")) : {};

// Signup
app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;
  if (users[username]) return res.status(400).json({ error: "User exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  users[username] = { password: hashedPassword };
  fs.writeFileSync("users.json", JSON.stringify(users));
  res.json({ success: true });
});

// Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  res.json({ success: true, username });
});

// Shorten URL
app.post("/api/shorten", (req, res) => {
  const { longUrl, custom, username } = req.body;
  const shortId = custom || nanoid(6);
  if (urls[shortId]) return res.status(409).json({ error: "Short ID already taken" });

  urls[shortId] = {
    longUrl,
    username,
    clickCount: 0,
    createdAt: new Date().toISOString()
  };
  fs.writeFileSync("urls.json", JSON.stringify(urls));
  res.json({
    shortUrl: `${req.protocol}://${req.get("host")}/${shortId}`,
    qr: `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(`${req.protocol}://${req.get("host")}/${shortId}`)}`
  });
});

// Redirect and count clicks
app.get("/:shortId", (req, res) => {
  const entry = urls[req.params.shortId];
  if (entry) {
    entry.clickCount++;
    fs.writeFileSync("urls.json", JSON.stringify(urls));
    return res.redirect(entry.longUrl);
  }
  res.status(404).send("Short URL not found");
});

// Get all user URLs
app.get("/api/urls/:username", (req, res) => {
  const userUrls = Object.entries(urls).filter(([_, v]) => v.username === req.params.username);
  res.json(Object.fromEntries(userUrls));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
