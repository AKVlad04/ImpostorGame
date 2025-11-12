document.addEventListener('DOMContentLoaded', () => {
  const playersCard = document.getElementById('playersCard');
  const impostorCard = document.getElementById('impostorCard');
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  const closeBtn = document.querySelector('.close');
  const playerCountSpan = document.querySelector('#playersCard .player-count');
  const impostorCountSpan = document.querySelector('#impostorCard .impostor-count');

  // 🧍 Lista de jucători
  let players = ['Player 1', 'Player 2', 'Player 3'];
  // 🕵️ Număr impostori
  let impostors = 1;

  // 🧍 Render lista jucători
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

    // Secțiune input + buton
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

  // 👥 Render pentru impostori
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

    plusBtn.addEventListener('click', () => {
      if (impostors < maxImpostors) {
        impostors++;
        impostorDisplay.textContent = `Impostori actuali: ${impostors}`;
        updateImpostorCount();
      } else {
        const warning = document.createElement('p');
        warning.textContent = `La ${players.length} jucători, maxim ${maxImpostors} impostor(i)!`;
        warning.classList.add('warning-text');
        modalBody.appendChild(warning);
        setTimeout(() => warning.remove(), 2000);
      }
    });

    minusBtn.addEventListener('click', () => {
      if (impostors > 1) {
        impostors--;
        impostorDisplay.textContent = `Impostori actuali: ${impostors}`;
        updateImpostorCount();
      }
    });
  }

  // 🔢 Actualizare număr jucători
  function updatePlayerCount() {
    playerCountSpan.textContent = players.length;
  }

  // 🕵️ Actualizare număr impostori
  function updateImpostorCount() {
    if (impostorCountSpan) impostorCountSpan.textContent = impostors;
  }

  // 🟢 Inițializare
  updatePlayerCount();
  updateImpostorCount();

  // 📋 Evenimente click
  playersCard.addEventListener('click', () => {
    renderPlayers();
    modal.style.display = 'flex';
  });

  impostorCard.addEventListener('click', () => {
    renderImpostors();
    modal.style.display = 'flex';
  });

  // ❌ Închidere modal
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});
