const wynikDiv = document.getElementById('wynik');

const html5QrCode = new Html5Qrcode("preview");

Html5Qrcode.getCameras().then(devices => {
  if (devices && devices.length) {
    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      qrCodeMessage => {
        try {
          const bilet = JSON.parse(qrCodeMessage);
          const bilety = JSON.parse(localStorage.getItem('bilety') || "[]");
          const znaleziony = bilety.find(b => JSON.stringify(b) === JSON.stringify(bilet));
          if (znaleziony) {
            wynikDiv.innerHTML = `<p style="color:green;">✅ Bilet poprawny: ${bilet.film}, ${bilet.data}, ${bilet.miejsce}</p>`;
          } else {
            wynikDiv.innerHTML = `<p style="color:red;">❌ Bilet nieprawidłowy lub nieznaleziony.</p>`;
          }
        } catch (e) {
          wynikDiv.innerHTML = `<p style="color:red;">❌ Nieczytelny kod QR.</p>`;
        }
      },
      errorMessage => {}
    );
  }
}).catch(err => {
  wynikDiv.innerHTML = `<p style="color:red;">Błąd kamery: ${err}</p>`;
});