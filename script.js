function shortenUrl() {
  const longUrl = document.getElementById('longUrl').value;
  const custom = document.getElementById('custom').value;

  fetch('/shorten', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ longUrl, custom })
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      document.getElementById('result').innerText = data.error;
    } else {
      document.getElementById('result').innerHTML = `
        Short URL: <a href="/${data.short}" target="_blank">${window.location.origin}/${data.short}</a><br>
        Clicks: ${data.clicks || 0}
      `;
    }
  });
}
