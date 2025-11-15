document.addEventListener('DOMContentLoaded', () => {
  const playersCard = document.getElementById('playersCard');
  const impostorCard = document.getElementById('impostorCard');
  const categoriiCard = document.getElementById('categoriiCard');
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  const closeBtn = document.querySelector('.close');
  const playerCountSpan = document.querySelector('#playersCard .player-count');
  const impostorCountSpan = document.querySelector('#impostorCard .impostor-count');
  const startGameBtn = document.getElementById("startGameBtn");
  const gameArea = document.getElementById("gameArea");

  let players = ['Player 1', 'Player 2', 'Player 3'];
  let impostors = 1;

  const database = {
    Animale: ["leu","tigru","vulpe","urs","pisică","câine"],
    Mâncare: ["pizza","burger","supa","paste","cartofi"],
    Țări: ["România","Italia","Germania","Franța","Spania"],
    Sporturi: ["fotbal","baschet","tenis","volei","înot"],
    Culori: ["roșu","albastru","verde","galben","mov"],
    Obiecte: ["telefon","masă","scaun","TV","pix"]
  };

  if (!sessionStorage.getItem('usedWords')) sessionStorage.setItem('usedWords', JSON.stringify([]));
  if (!sessionStorage.getItem('selectedCategories')) sessionStorage.setItem('selectedCategories', JSON.stringify([]));

  function getUsedWords() { return JSON.parse(sessionStorage.getItem('usedWords')); }
  function addUsedWord(word) { 
    const used = getUsedWords();
    used.push(word);
    sessionStorage.setItem('usedWords', JSON.stringify(used));
  }
  function getSelectedCategories() { return JSON.parse(sessionStorage.getItem('selectedCategories')); }
  function setSelectedCategories(arr) { sessionStorage.setItem('selectedCategories', JSON.stringify(arr)); }

  function renderPlayers() {
    modalBody.innerHTML = '';
    const ul = document.createElement('ul');
    ul.classList.add('players-list');
    players.forEach((player, index) => {
      const li = document.createElement('li');
      li.textContent = player;
      li.classList.add('player-item');
      const delBtn = document.createElement('button');
      delBtn.textContent = '🗑️';
      delBtn.classList.add('delete-btn');
      delBtn.addEventListener('click', () => {
        players.splice(index, 1);
        renderPlayers();
        updatePlayerCount();
        updateImpostorCount();
      });
      li.appendChild(delBtn);
      ul.appendChild(li);
    });
    modalBody.appendChild(ul);

    const addSection = document.createElement('div');
    addSection.classList.add('add-player-section');
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Nume jucător';
    input.classList.add('add-player-input');
    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add Player';
    addBtn.classList.add('add-player-btn');
    addBtn.addEventListener('click', () => {
      const name = input.value.trim();
      if (name !== '') {
        players.push(name);
        input.value = '';
        renderPlayers();
        updatePlayerCount();
        updateImpostorCount();
      }
    });
    addSection.appendChild(input);
    addSection.appendChild(addBtn);
    modalBody.appendChild(addSection);
  }

function renderImpostors() {
  modalBody.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = 'Setează numărul de impostori';
  modalBody.appendChild(title);

  const info = document.createElement('p');
  info.textContent = `Număr jucători: ${players.length}`;
  info.classList.add('impostor-info');
  modalBody.appendChild(info);

  const impostorDisplay = document.createElement('h3');
  impostorDisplay.textContent = `Impostori actuali: ${impostors}`;
  impostorDisplay.classList.add('impostor-display');
  modalBody.appendChild(impostorDisplay);

  const warningText = document.createElement('p');
  warningText.classList.add('warning-text');
  warningText.style.color = 'red';
  warningText.style.height = '1.5em'; // să păstreze spațiul chiar și când e gol
  modalBody.appendChild(warningText);

  const buttonsDiv = document.createElement('div');
  buttonsDiv.classList.add('impostor-buttons');

  const minusBtn = document.createElement('button');
  minusBtn.textContent = '−';
  minusBtn.classList.add('impostor-btn');

  const plusBtn = document.createElement('button');
  plusBtn.textContent = '+';
  plusBtn.classList.add('impostor-btn');

  buttonsDiv.appendChild(minusBtn);
  buttonsDiv.appendChild(plusBtn);
  modalBody.appendChild(buttonsDiv);

  // 🔢 Limită maximă impostori
  let maxImpostors = 1;
  if (players.length >= 5 && players.length <= 7) maxImpostors = 2;
  else if (players.length >= 8 && players.length <= 10) maxImpostors = 3;
  else if (players.length >= 11 && players.length <= 13) maxImpostors = 4;
  else if (players.length >= 14) maxImpostors = 5;

  plusBtn.onclick = () => {
    if (impostors < maxImpostors) {
      impostors++;
      impostorDisplay.textContent = `Impostori actuali: ${impostors}`;
      updateImpostorCount();
      warningText.textContent = ''; // șterge warning-ul
    } else {
      warningText.textContent = `La ${players.length} jucători, maxim ${maxImpostors} impostor(i)!`;
    }
  };

  minusBtn.onclick = () => {
    if (impostors > 1) {
      impostors--;
      impostorDisplay.textContent = `Impostori actuali: ${impostors}`;
      updateImpostorCount();
      warningText.textContent = '';
    }
  };
}

  function updatePlayerCount() { playerCountSpan.textContent = players.length; }
  function updateImpostorCount() { impostorCountSpan.textContent = impostors; }

  updatePlayerCount();
  updateImpostorCount();

  // --- RENDER CATEGORII ---
  function renderCategories() {
    modalBody.innerHTML = '';
    const h = document.createElement('h2');
    h.textContent = "Alege Categorii";
    modalBody.appendChild(h);

    const grid = document.createElement('div');
    grid.classList.add('category-list');

    Object.keys(database).forEach(cat => {
      const item = document.createElement('div');
      item.classList.add('cat-item');

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.value = cat;
      cb.id = "cat-" + cat;
      if (getSelectedCategories().includes(cat)) cb.checked = true;

      const label = document.createElement('label');
      label.textContent = cat;
      label.htmlFor = cb.id;

      // Click pe div sau label selectează checkbox
      item.addEventListener('click', e => {
        if (e.target.tagName !== 'INPUT') cb.checked = !cb.checked;
        const selected = [...document.querySelectorAll('.cat-item input:checked')].map(i => i.value);
        setSelectedCategories(selected);
      });

      label.addEventListener('click', e => {
        e.preventDefault();
        cb.checked = !cb.checked;
        const selected = [...document.querySelectorAll('.cat-item input:checked')].map(i => i.value);
        setSelectedCategories(selected);
      });

      item.appendChild(cb);
      item.appendChild(label);
      grid.appendChild(item);
    });

    modalBody.appendChild(grid);
  }

  // --- START GAME ---
  startGameBtn.addEventListener("click", () => {
    const selectedCategories = getSelectedCategories();
    if (selectedCategories.length === 0) {
      alert("Selectează măcar o categorie!");
      return;
    }

    modal.style.display = "none";
    gameArea.innerHTML = "";

    players.forEach(player => {
      const box = document.createElement("div");
      box.classList.add("player-box");

      const name = document.createElement("h3");
      name.textContent = player;

      const circle = document.createElement("div");
      circle.classList.add("player-circle");
      circle.textContent = player[0].toUpperCase();

      box.appendChild(name);
      box.appendChild(circle);
      gameArea.appendChild(box);
    });

    document.querySelector(".lobby").style.display = "none";
    startGameBtn.style.display = "none";
  });

  // --- CLICK EVENTS ---
  playersCard.addEventListener('click', () => { renderPlayers(); modal.style.display = 'flex'; });
  impostorCard.addEventListener('click', () => { renderImpostors(); modal.style.display = 'flex'; });
  categoriiCard.addEventListener('click', () => { renderCategories(); modal.style.display = 'flex'; });

  closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
  window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });
});
