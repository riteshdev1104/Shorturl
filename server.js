const express = require("express");
const fs = require("fs");
const { nanoid } = require("nanoid");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

let urls = {};
if (fs.existsSync("urls.json")) {
  urls = JSON.parse(fs.readFileSync("urls.json", "utf-8"));
}

app.post("/api/shorten", (req, res) => {
  const { longUrl } = req.body;
  const shortId = nanoid(6);
  urls[shortId] = longUrl;
  fs.writeFileSync("urls.json", JSON.stringify(urls));
  res.json({ shortUrl: `${req.protocol}://${req.get("host")}/${shortId}` });
});

app.get("/:shortId", (req, res) => {
  const longUrl = urls[req.params.shortId];
  if (longUrl) return res.redirect(longUrl);
  res.status(404).send("URL not found");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
