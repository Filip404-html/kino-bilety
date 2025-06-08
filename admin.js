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

const listaBiletowEl = document.getElementById('lista-biletow');
const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById('close-modal');
const biletInfo = document.getElementById('bilet-info');
const btnPrzepusc = document.getElementById('btn-przepusc');
const btnZablokuj = document.getElementById('btn-zablokuj');

let bilety = JSON.parse(localStorage.getItem('bilety')) || [];
let wybranyBiletIndex = null;

function pokazListeBiletow() {
  if (bilety.length === 0) {
    listaBiletowEl.innerHTML = '<p>Brak sprzedanych biletów.</p>';
    return;
  }
  listaBiletowEl.innerHTML = '';
  bilety.forEach((bilet, index) => {
    const div = document.createElement('div');
    div.classList.add('bilet-item');
    div.textContent = `${bilet.film} - ${bilet.data} - ${bilet.miejsce}`;
    div.addEventListener('click', () => {
      wybranyBiletIndex = index;
      pokazModal(bilet);
    });
    listaBiletowEl.appendChild(div);
  });
}

function pokazModal(bilet) {
  biletInfo.innerHTML = `
    <p><strong>Film:</strong> ${bilet.film}</p>
    <p><strong>Data:</strong> ${bilet.data}</p>
    <p><strong>Godzina:</strong> ${bilet.godzina}</p>
    <p><strong>Miejsce:</strong> ${bilet.miejsce}</p>
    <p><strong>ID:</strong> ${bilet.id}</p>
  `;
  modal.style.display = 'block';
}

closeModalBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

btnPrzepusc.addEventListener('click', () => {
  alert('Bilet przepuszczony!');
  usunBilet();
});

btnZablokuj.addEventListener('click', () => {
  alert('Bilet zablokowany!');
  usunBilet();
});

function usunBilet() {
  if (wybranyBiletIndex !== null) {
    bilety.splice(wybranyBiletIndex, 1);
    localStorage.setItem('bilety', JSON.stringify(bilety));
    pokazListeBiletow();
    modal.style.display = 'none';
  }
}

// Inicjalizacja
pokazListeBiletow();
