document.addEventListener('DOMContentLoaded', () => {

  const playersCard = document.getElementById('playersCard');
  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  const closeBtn = document.querySelector('.close');
  const playerCountSpan = document.querySelector('#playersCard .player-count');

  // Array pentru jucători
  let players = ['Player 1', 'Player 2', 'Player 3'];

  // Funcție care generează lista în modal
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
      });

      li.appendChild(delBtn);
      ul.appendChild(li);
    });

    modalBody.appendChild(ul);

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
      }
    });

    modalBody.appendChild(input);
    modalBody.appendChild(addBtn);
  }

  // Actualizare număr jucători pe card
  function updatePlayerCount() {
    playerCountSpan.textContent = players.length;
  }

  // Inițial update
  updatePlayerCount();

  // Deschidere modal pentru Jucători
  playersCard.addEventListener('click', () => {
    renderPlayers();
    modal.style.display = 'flex';
  });

  // Închidere modal
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

});
