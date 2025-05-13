let currentUser = "";

async function signup() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const res = await fetch("/api/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (data.success) {
    alert("Signed up! Now log in.");
  } else {
    alert(data.error || "Signup failed");
  }
}

async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (data.success) {
    currentUser = username;
    document.getElementById("auth").style.display = "none";
    document.getElementById("shorten").style.display = "block";
    loadUrls();
  } else {
    alert(data.error || "Login failed");
  }
}

async function shortenUrl() {
  const longUrl = document.getElementById("longUrl").value;
  const custom = document.getElementById("custom").value;
  const res = await fetch("/api/shorten", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ longUrl, custom, username: currentUser })
  });
  const data = await res.json();
  if (data.shortUrl) {
    document.getElementById("result").innerHTML = 
      \`Short URL: <a href="\${data.shortUrl}" target="_blank">\${data.shortUrl}</a><br><img src="\${data.qr}" width="100">\`;
    loadUrls();
  } else {
    alert(data.error || "Failed");
  }
}

async function loadUrls() {
  const res = await fetch("/api/urls/" + currentUser);
  const data = await res.json();
  const list = Object.entries(data).map(
    ([id, url]) => \`<div><a href="/\${id}" target="_blank">\${location.origin}/\${id}</a> → \${url.longUrl} [Clicks: \${url.clickCount}]</div>\`
  ).join("");
  document.getElementById("myUrls").innerHTML = list;
}
