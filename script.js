const salaDiv = document.getElementById('sala');
const kupBiletBtn = document.getElementById('kup-bilet');
const drukujBiletBtn = document.getElementById('drukuj-bilet');
const biletDiv = document.getElementById('bilet');
const biletContainer = document.getElementById('bilet-container');

let selectedSeat = null;
const zajeteMiejsca = ['0-1', '2-3', '4-5'];

// Tworzymy siatkę 6x6 miejsc
function stworzSale() {
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      const miejsce = document.createElement('div');
      miejsce.classList.add('miejsce');
      const key = `${r}-${c}`;

      miejsce.textContent = `R${r + 1}M${c + 1}`;

      if (zajeteMiejsca.includes(key)) {
        miejsce.classList.add('zajete');
      } else {
        miejsce.addEventListener('click', () => {
          document.querySelectorAll('.miejsce.wybrane').forEach(m => m.classList.remove('wybrane'));
          miejsce.classList.add('wybrane');
          selectedSeat = key;
        });
      }
      salaDiv.appendChild(miejsce);
    }
  }
}

// Kupowanie biletu
function kupBilet() {
  if (!selectedSeat) {
    alert("Wybierz miejsce!");
    return;
  }

  const film = document.getElementById('film').value;
  const data = document.getElementById('data').value;
  const godzina = document.getElementById('godzina').value;

  if (!data) {
    alert("Wybierz datę!");
    return;
  }

  const bilet = {
    film,
    data,
    godzina,
    miejsce: `R${parseInt(selectedSeat.split('-')[0]) + 1} M${parseInt(selectedSeat.split('-')[1]) + 1}`,
    id: Date.now() + Math.random().toString(36).slice(2)
  };

  pokazBilet(bilet);
}

// Pokazujemy bilet z QR kodem
function pokazBilet(bilet) {
  biletDiv.innerHTML = `
    <h2>Multikino</h2>
    <hr />
    <p><strong>Film:</strong> ${bilet.film}</p>
    <p><strong>Data:</strong> ${bilet.data}</p>
    <p><strong>Godzina:</strong> ${bilet.godzina}</p>
    <p><strong>Miejsce:</strong> ${bilet.miejsce}</p>
    <p style="font-size: 0.8em; color: gray;">ID biletu: ${bilet.id}</p>
    <canvas id="qr-code-canvas"></canvas>
    <img id="qr-code-img" style="display:none; max-width:140px; margin-top:10px;" />
  `;

  // Generujemy QR na canvasie
  QRCode.toCanvas(document.getElementById('qr-code-canvas'), JSON.stringify(bilet), {
    width: 140,
    margin: 2,
    color: {
      dark: '#d63078',
      light: '#ffffff'
    }
  }, function (error) {
    if (error) {
      console.error(error);
    } else {
      // Konwertujemy canvas do obrazka
      const canvas = document.getElementById('qr-code-canvas');
      const img = document.getElementById('qr-code-img');
      img.src = canvas.toDataURL('image/png');
    }
  });

  biletContainer.style.display = 'block';
  window.lastBilet = bilet;
}
function generujPDF() {
  const element = document.getElementById('bilet');
  if (!element) {
    alert('Brak biletu do wydrukowania!');
    return;
  }

  const canvas = document.getElementById('qr-code-canvas');
  const img = document.getElementById('qr-code-img');

  if (canvas && img) {
    canvas.style.display = 'none';
    img.style.display = 'block';
  }

  setTimeout(() => {
    const opt = {
      margin: 0.3,
      filename: 'bilet_multikino.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 3, dpi: 192 },
      jsPDF: { unit: 'in', format: 'a6', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      if (canvas && img) {
        canvas.style.display = 'block';
        img.style.display = 'none';
      }
    });
  }, 700);
}
// Nasłuchiwanie przycisków
kupBiletBtn.addEventListener('click', kupBilet);
drukujBiletBtn.addEventListener('click', generujPDF);

stworzSale();

function kupBilet() {
  // ... istniejący kod ...
  pokazBilet(bilet);

  // Zapisz bilet do localStorage
  const bilety = JSON.parse(localStorage.getItem('bilety')) || [];
  bilety.push(bilet);
  localStorage.setItem('bilety', JSON.stringify(bilety));
}
