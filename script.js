document.addEventListener('DOMContentLoaded', () => {
// --- ELEMENTE DIN LOBBY ---
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
const startSection = document.getElementById("startSection");

// --- ELEMENTE DIN PAGINA REVEAL ---
const revealView = document.getElementById('revealView');
const revealPlayerName = document.getElementById('revealPlayerName');
const revealCategory = document.getElementById('revealCategory');
const revealBox = document.getElementById('revealBox');
const revealContent = document.getElementById('revealContent');
const revealPrompt = document.getElementById('revealPrompt');
const revealConfirmBtn = document.getElementById('revealConfirmBtn');

// --- ELEMENTE BUTON BACK ---
const backButtonContainer = document.getElementById('backButtonContainer');
const backToLobbyBtn = document.getElementById('backToLobbyBtn');

// --- ELEMENTE ECRAN FINAL ---
const endGameView = document.getElementById('endGameView');
const startingPlayerText = document.getElementById('startingPlayerText');
const revealImpostorBtn = document.getElementById('revealImpostorBtn');
const resultsArea = document.getElementById('resultsArea');
const impostorResult = document.getElementById('impostorResult');
const wordResult = document.getElementById('wordResult');
const playAgainBtn = document.getElementById('playAgainBtn');


// --- STAREA JOCULUI ---
let players = ['Player 1', 'Player 2', 'Player 3'];
let impostors = 1;

// Variabile pentru jocul curent
let currentGamePlayers = [];
let currentGameWord = '';
let currentGameCategory = '';
let activePlayerBox = null;
let viewedPlayerCount = 0;
let particleInterval = null; // Variabila pentru particule

// --- BAZA DE DATE ---
const database = {
Mancare: ["pizza","burger","supă","paste","cartofi","orez","friptură","pui","salată","pește","omletă","sandwich","hotdog","kebab","sushi","tacos","ciorbă","tort","prăjitură","înghețată","ciocolată","pâine","lapte","brânză","iaurt","măr","banană","portocală","struguri","cartofi prăjiți","piure","clătite","covrig"],
Bauturi: ["apă","suc de portocale","suc de mere","cola","pepsi","fanta","sprite","ceai verde","limonadă","milkshake","smoothie","lapte","cafea","capuccino","latte","mocha","espresso","frappé","ciocolată caldă","energizant","apă minerală","sirop","nectar","fresh de portocale"],
Obiecte: ["telefon","masă","scaun","TV","pix","laptop","carte","pat","lampă","cheie","geamantan","cană","lingură","furculiță","cuțit","ghiozdan","perie","mouse","tastatură","monitor","ceas","umbrelă","tricou","șapcă","ciocan","cutie","creion"],
Sporturi: ["fotbal","baschet","tenis","volei","înot","alergare","ciclism","box","karate","schi","snowboard","gimnastică","golf","ping-pong","badminton","handbal","patinaj","surf","skateboarding"],
Locatii: ["parc","școală","spital","mall","plajă","hotel","restaurant","cafenea","cinema","muzeu","gară","aeroport","stadion","bibliotecă","birou","pădure","munte","piscină","stradă","piață"],
Tari: ["România","Italia","Germania","Franța","Spania","Grecia","Turcia","SUA","Canada","Brazilia","Marea Britanie","Japonia","China","Australia","Rusia","Mexic","Argentina","Egipt"],
Profesii: ["doctor","profesor","inginer","mecanic","polițist","pompier","bucătar","chelner","șofer","pilot","dentist","arhitect","electrician","tâmplar","croitor","vânzător","casier","fermier","programator","designer","fotograf","videograf","avocat","judecător","antrenor","sportiv","muzician","cântăreț","actor","jurnalist","medic veterinar","psiholog","instalator","zugrav","constructor","curier","manager","contabil"],
Animale: ["leu","tigru","vulpe","urs","pisică","câine","elefant","girafă","zebră","lup","cerb","iepure","veveriță","bufniță","vultur","papagal","găină","rață","delfin","rechin","balenă","broască","cal","măgar","pinguin","crocodil","șarpe","broască țestoasă","vacă","porc","oaie","capră","albină","furnică","fluture","păianjen"],
Culori: ["roșu","albastru","verde","galben","mov","portocaliu","negru","alb","gri","maro"],
Superputeri: ["zbor","invizibilitate","super-viteză","telepatie","teleportare","super-forță","controlul focului","controlul apei","controlul aerului","controlul pământului","regenerare","vedere nocturnă","îngheț","elasticitate","control electric","super-sărituri","levitație","vindecare"],
Marci: ["Apple","Samsung","Nike","Adidas","BMW","Mercedes","Audi","Sony","LG","Dell","HP","Coca-Cola","Pepsi","Ford","Toyota","Honda","Tesla","Google","Microsoft","Amazon","Ikea","Zara"],
Jocuri: ["Minecraft","GTA","CS:GO","LoL","Fortnite","Valorant","FIFA","Rocket League","Call of Duty","Among Us","Roblox","Dota 2","Brawl Stars","Clash Royale","Need for Speed","PUBG"]
};

// --- MODIFICARE: Folosim variabile in-memorie in loc de sessionStorage ---
// Acestea se vor reseta la fiecare refresh
let usedWords = [];
let selectedCategories = [];

// Nu mai avem nevoie de 'if (!sessionStorage...)'

function getUsedWords() { return usedWords; }
function addUsedWord(word) {
usedWords.push(word);
}
function getSelectedCategories() { return selectedCategories; }
function setSelectedCategories(arr) {
selectedCategories = arr;
}
// --- SFÂRȘIT MODIFICARE ---

// --- FUNCTII MODAL ---
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

const addPlayerAction = () => {
const name = input.value.trim();
if (name !== '') {
players.push(name);
input.value = '';
renderPlayers();
updatePlayerCount();
updateImpostorCount();
input.focus();
}
};

addBtn.addEventListener('click', addPlayerAction);
input.addEventListener('keydown', (e) => {
if (e.key === 'Enter') addPlayerAction();
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
warningText.style.height = '1.5em';
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

let maxImpostors = 1;
if (players.length >= 5 && players.length <= 7) maxImpostors = 2;
else if (players.length >= 8 && players.length <= 10) maxImpostors = 3;
else if (players.length >= 11 && players.length <= 13) maxImpostors = 4;
else if (players.length >= 14) maxImpostors = 5;

if (impostors > maxImpostors) {
impostors = maxImpostors;
impostorDisplay.textContent = `Impostori actuali: ${impostors}`;
updateImpostorCount();
}

plusBtn.onclick = () => {
if (impostors < maxImpostors) {
impostors++;
impostorDisplay.textContent = `Impostori actuali: ${impostors}`;
updateImpostorCount();
warningText.textContent = '';
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

function updateImpostorCount() {
let maxImpostors = 1;
if (players.length >= 5 && players.length <= 7) maxImpostors = 2;
else if (players.length >= 8 && players.length <= 10) maxImpostors = 3;
else if (players.length >= 11 && players.length <= 13) maxImpostors = 4;
else if (players.length >= 14) maxImpostors = 5;

if (impostors > maxImpostors) {
impostors = maxImpostors;
}
impostorCountSpan.textContent = impostors;
}


updatePlayerCount();
updateImpostorCount();

function renderCategories() {
modalBody.innerHTML = '';
const h = document.createElement('h2');
h.textContent = "Alege Categorii";
modalBody.appendChild(h);

const grid = document.createElement('div');
grid.classList.add('category-list');
const currentSelected = getSelectedCategories();

Object.keys(database).forEach(cat => {
const item = document.createElement('div');
item.classList.add('cat-item');

const cb = document.createElement('input');
cb.type = 'checkbox';
cb.value = cat;
cb.id = "cat-" + cat;
if (currentSelected.includes(cat)) cb.checked = true;

const label = document.createElement('label');
label.textContent = cat;
label.htmlFor = cb.id;

item.addEventListener('click', e => {
if (e.target.tagName !== 'INPUT') cb.checked = !cb.checked;
updateSelectedCategories();
});

cb.addEventListener('change', updateSelectedCategories);

item.appendChild(cb);
item.appendChild(label);
grid.appendChild(item);
});

modalBody.appendChild(grid);
}

function updateSelectedCategories() {
const selected = [...document.querySelectorAll('.cat-item input:checked')].map(i => i.value);
setSelectedCategories(selected);
}

// #### FUNCȚIA createParticle MODIFICATĂ (REPARAȚIE MEMORY LEAK) ####
function createParticle() {
const particle = document.createElement('div');
particle.classList.add('particle');

var color = `hsl(${Math.random() * 360}, 100%, 70%)`;
particle.style.background = color;
particle.style.borderRadius = '50%';
const width = Math.random() * 5 + 4;
particle.style.width = `${width}px`;
particle.style.height = `${width}px`;

if (revealBox.offsetWidth > 0 && revealBox.offsetHeight > 0) {
const revealBoxWidth = revealBox.offsetWidth;
const revealBoxHeight = revealBox.offsetHeight;
particle.style.left = `${Math.random() * (revealBoxWidth - width)}px`;
particle.style.top = `${Math.random() * (revealBoxHeight - width)}px`;
} else {
particle.style.left = '50%';
particle.style.top = '50%';
}

revealBox.appendChild(particle);

// Creăm cronometrul pentru a șterge particula
const timerId = setTimeout(() => {
particle.remove();
}, 1000); // Durata animației din CSS

// SALVĂM ID-ul cronometrului direct pe element!
particle.dataset.timerId = timerId;
}

// #### FUNCȚIA removeAllParticles MODIFICATĂ (REPARAȚIE MEMORY LEAK) ####
function removeAllParticles() {
const particles = revealBox.querySelectorAll('.particle');
particles.forEach(p => {
// 1. Citim ID-ul cronometrului salvat
const timerId = p.dataset.timerId;

// 2. ANULĂM cronometrul "zombie"
if (timerId) {
clearTimeout(timerId); 
}

// 3. Acum putem șterge elementul în siguranță
p.remove();
});
}
// #### SFÂRȘITUL MODIFICĂRILOR ####

// --- LOGICA JOC ---

function setupGame() {
// Resetam contorul
viewedPlayerCount = 0;

const selectedCategories = getSelectedCategories();

// 1. Alege Categoria
currentGameCategory = selectedCategories[Math.floor(Math.random() * selectedCategories.length)];

// 2. Alege Cuvantul
const wordList = database[currentGameCategory];
let availableWords = wordList.filter(word => !usedWords.includes(word)); // Folosim variabila globala usedWords

if (availableWords.length === 0) {
availableWords = wordList;
usedWords = []; // Resetam lista in-memory
}

currentGameWord = availableWords[Math.floor(Math.random() * availableWords.length)];
addUsedWord(currentGameWord);

// 3. Asigneaza Roluri
currentGamePlayers = players.map(name => ({ name: name, role: 'normal' }));

let impostorsToAssign = impostors;
while (impostorsToAssign > 0) {
let randIndex = Math.floor(Math.random() * currentGamePlayers.length);

if (currentGamePlayers[randIndex].role === 'normal') {
currentGamePlayers[randIndex].role = 'impostor';
impostorsToAssign--;
}
}
console.log("Joc Setup:", currentGamePlayers, currentGameWord, currentGameCategory);
}

// --- HANDLERE PAGINA DE JOC ---

function handlePlayerBoxClick(e) {
const box = e.currentTarget;
if (box.classList.contains('viewed')) return;

activePlayerBox = box;
const playerIndex = box.dataset.playerIndex;
const playerData = currentGamePlayers[playerIndex];

revealPlayerName.textContent = `Cuvant pentru ${playerData.name}`;
revealCategory.textContent = `Categorie: ${currentGameCategory}`;
revealBox.dataset.role = playerData.role;
revealBox.dataset.word = currentGameWord;
revealBox.classList.remove('revealed', 'impostor');
revealContent.innerHTML = '';
revealPrompt.style.display = 'block';
revealConfirmBtn.style.display = 'none';

// #### START PARTICULE (cu interval rezonabil) ####
if (particleInterval) clearInterval(particleInterval);
particleInterval = setInterval(createParticle, 2); // 20 particule/sec, mult mai sigur!

document.body.classList.add('modal-open');
revealView.classList.add('visible');
}

// Click pe cutia de dezvaluit
revealBox.addEventListener('click', () => {
if (revealBox.classList.contains('revealed')) return;

// #### STOP PARTICULE (corectat) ####
if (particleInterval) clearInterval(particleInterval);
removeAllParticles(); // Acum anulează și cronometrele

revealBox.classList.add('revealed');
revealPrompt.style.display = 'none';
revealConfirmBtn.style.display = 'block';

const role = revealBox.dataset.role;
const word = revealBox.dataset.word;

if (role === 'impostor') {
revealBox.classList.add('impostor');
revealContent.innerHTML = `IMPOSTOR`;
} else {
revealContent.innerHTML = `${word}`;
}
});

// Click pe butonul "Inteles!"
revealConfirmBtn.addEventListener('click', () => {
revealView.classList.remove('visible');
document.body.classList.remove('modal-open');

// #### CURATARE PARTICULE (corectat) ####
if (particleInterval) clearInterval(particleInterval);
removeAllParticles(); // Acum anulează și cronometrele

// Acest cod ruleaza acum corect
if (activePlayerBox) {
if (!activePlayerBox.classList.contains('viewed')) {
activePlayerBox.classList.add('viewed');
viewedPlayerCount++;

if (viewedPlayerCount === currentGamePlayers.length) {
showEndGameSummary();
}
}
activePlayerBox = null;
}
});

// --- FUNCTII ECRAN FINAL ---
function showEndGameSummary() {
const startingPlayer = currentGamePlayers[Math.floor(Math.random() * currentGamePlayers.length)];
startingPlayerText.textContent = `${startingPlayer.name} începe runda!`;

resultsArea.style.display = 'none';
playAgainBtn.style.display = 'none';
revealImpostorBtn.style.display = 'block';
document.body.classList.add('modal-open');
endGameView.classList.add('visible');
}

// Listener pentru butonul de dezvaluire
revealImpostorBtn.addEventListener('click', () => {
const impostorNames = currentGamePlayers
.filter(p => p.role === 'impostor')
.map(p => p.name);

if (impostors == 1)
impostorResult.textContent = `Impostor: ${impostorNames.join(', ')}`;
else
impostorResult.textContent = `Impostori: ${impostorNames.join(', ')}`;
wordResult.textContent = `Cuvântul: ${currentGameWord}`;

resultsArea.style.display = 'block';
playAgainBtn.style.display = 'block';
revealImpostorBtn.style.display = 'none';
});

// Listener pentru "Joaca din nou"
playAgainBtn.addEventListener('click', () => {
endGameView.classList.remove('visible');
backToLobbyBtn.click();
});


// --- START GAME ---
startGameBtn.addEventListener("click", () => {
const selectedCategories = getSelectedCategories();
if (selectedCategories.length === 0) {
alert("Selectează măcar o categorie!");
return;
}

if (players.length < 3) {
alert("Minim 3 jucători pentru a începe!");
return;
}

setupGame();
modal.style.display = "none";
gameArea.innerHTML = "";

currentGamePlayers.forEach((player, index) => {
const box = document.createElement("div");
box.classList.add("player-box");
box.dataset.playerIndex = index;

const name = document.createElement("h3");
name.textContent = player.name;

const circle = document.createElement("div");
circle.classList.add("player-circle");
circle.textContent = player.name[0].toUpperCase();

// Aici era eroarea de sintaxă ('Mconst...'). Am corectat-o.
const overlay = document.createElement('div');
overlay.classList.add('viewed-overlay');
overlay.textContent = player.name + ' a văzut deja cuvântul';

box.appendChild(circle);
box.appendChild(name);
box.appendChild(overlay);
gameArea.appendChild(box);

box.addEventListener('click', handlePlayerBoxClick);
});

document.querySelector(".lobby").style.display = "none";
startSection.style.display = "none";
backButtonContainer.style.display = "block";
});

// --- CLICK EVENTS LOBBY / MODAL ---
playersCard.addEventListener('click', () => { renderPlayers(); modal.style.display = 'flex'; });
impostorCard.addEventListener('click', () => { renderImpostors(); modal.style.display = 'flex'; });
categoriiCard.addEventListener('click', () => { renderCategories(); modal.style.display = 'flex'; });

closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

// --- LISTENER BUTON BACK TO LOBBY ---
backToLobbyBtn.addEventListener('click', () => {
document.body.classList.remove('modal-open');
// Arata lobby
document.querySelector(".lobby").style.display = "flex";
startSection.style.display = "flex";

// Ascunde joc
gameArea.innerHTML = "";
backButtonContainer.style.display = "none";

// Ascunde ferestrele (daca sunt deschise)
revealView.classList.remove('visible');
endGameView.classList.remove('visible');

// #### CURATARE PARTICULE (corectat) ####
if (particleInterval) clearInterval(particleInterval);
removeAllParticles(); // Acum anulează și cronometrele

// Reseteaza variabilele de joc
currentGamePlayers = [];
currentGameWord = '';
currentGameCategory = '';
activePlayerBox = null;
viewedPlayerCount = 0;
});

}); // Sfarsitul DOMContentLoaded