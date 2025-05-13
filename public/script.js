async function shortenUrl() {
  const longUrl = document.getElementById("longUrl").value;
  const res = await fetch("/api/shorten", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ longUrl }),
  });
  const data = await res.json();
  document.getElementById("result").innerHTML = `<a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`;
}
