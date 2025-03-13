async function shortenLink() {
    const longUrl = document.getElementById("longUrl").value;
    const customSlug = document.getElementById("customSlug").value;
    const result = document.getElementById("result");

    if (!longUrl) {
        result.textContent = "Masukkan URL yang valid!";
        return;
    }

    const response = await fetch("/api/shorten", { // Gunakan /api/
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ longUrl, slug: customSlug })
    });

    const data = await response.json();
    if (data.shortUrl) {
        result.innerHTML = `Shortened Link: <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`;
    } else {
        result.textContent = "Gagal membuat short link.";
    }
}
