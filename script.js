// Selectors
const mainMenu = document.getElementById('main-menu');
const startScreen = document.getElementById('start-screen');
const gameContainer = document.getElementById('game-container');
const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const currentPlayerDiv = document.getElementById('current-player');
const timerSpan = document.getElementById('timer');
const restartBtn = document.getElementById('restart-btn');
const resetScoresBtn = document.getElementById('reset-scores-btn');
const backToMenuBtn = document.getElementById('back-to-menu-btn');
const mainMenuStartBtn = document.getElementById('btn-start');
const instructionsBtn = document.getElementById('btn-instructions');
const aboutBtn = document.getElementById('btn-about');
const quitBtn = document.getElementById('btn-quit');
const mainMenuResetScoresBtn = document.getElementById('btn-reset-scores');

// Scoreboard refs
const player1NameInput = document.getElementById('player1-name');
const player2NameInput = document.getElementById('player2-name');
const player1ChoiceSelect = document.getElementById('player1-choice');
const gameModeSelect = document.getElementById('game-mode');
const difficultySelect = document.getElementById('difficulty');
const player1ScoreName = document.getElementById('player1-score-name');
const player2ScoreName = document.getElementById('player2-score-name');
const player1ScoreSpan = document.getElementById('player1-score');
const player2ScoreSpan = document.getElementById('player2-score');
const drawsCountSpan = document.getElementById('draws-count');

// Game variables
let boardState = Array(9).fill(null);
let currentPlayer = 'X';
let player1Name = 'Player 1';
let player2Name = 'Player 2';
let player1Choice = 'X';
let gameMode = 'pvp';
let difficulty = 'easy';
let player1Score = 0;
let player2Score = 0;
let draws = 0;
let timer = 10, timerInterval = null;
let gameActive = false;

// Winning combos
const winningCombinations = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// Navigation logic
mainMenu.style.display = 'block';
startScreen.style.display = 'none';
gameContainer.style.display = 'none';

mainMenuStartBtn.addEventListener('click', () => {
  mainMenu.style.display = 'none';
  startScreen.style.display = 'block';
});

backToMenuBtn.addEventListener('click', () => {
  gameActive = false;
  clearInterval(timerInterval);
  mainMenu.style.display = 'block';
  startScreen.style.display = 'none';
  gameContainer.style.display = 'none';
});

instructionsBtn.addEventListener('click', () => alert(
  `Instructions:
- Enter player names, choose X or O.
- Select game mode (PvP vs PvC) and difficulty for AI.
- Take turns placing marks.
- First to make 3 in a row wins!`
));

aboutBtn.addEventListener('click', () => alert(`About:\nElihle's Tic Tac Toe game built by you!`));
quitBtn.addEventListener('click', () => alert('Thanks for playing! You can close the tab.'));
mainMenuResetScoresBtn.addEventListener('click', () => {
  resetScores();
  alert('Scores have been reset!');
});

// Core gameplay functions
function startTimer() {
  timer = 10; timerSpan.textContent = timer;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (--timer <= 0) handleTimeout();
    timerSpan.textContent = timer;
  }, 1000);
}

function handleTimeout() {
  clearInterval(timerInterval);
  alert(`Time's up! Turn skipped for player ${currentPlayer}`);
  switchPlayer(); startTimer();
}

function switchPlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateCurrentPlayerDisplay();
  if (gameMode === 'pvc' && currentPlayer !== player1Choice) computerMove();
}

function updateCurrentPlayerDisplay() {
  const name = currentPlayer === player1Choice ? player1Name : player2Name;
  currentPlayerDiv.textContent = `${name} (${currentPlayer})'s turn`;
}

function checkWinner() {
  for (const [a,b,c] of winningCombinations)
    if (boardState[a] && boardState[a] === boardState[b] && boardState[b] === boardState[c]) 
      return boardState[a];
  return boardState.every(c=>c) ? 'draw' : null;
}

function handleWin(result) {
  gameActive = false; clearInterval(timerInterval);
  if (result === 'draw') {
    draws++; drawsCountSpan.textContent = draws;
    alert("It's a draw!");
  } else {
    if (result === player1Choice) {
      player1Score++; player1ScoreSpan.textContent = player1Score;
      alert(`${player1Name} wins!`);
    } else {
      player2Score++; player2ScoreSpan.textContent = player2Score;
      alert(`${player2Name} wins!`);
    }
  }
}

function makeMove(i) {
  if (!gameActive || boardState[i]) return;
  boardState[i] = currentPlayer;
  cells[i].textContent = currentPlayer;
  const win = checkWinner();
  if (win) return handleWin(win);
  switchPlayer(); startTimer();
}

function computerMove() {
  board.classList.add('no-click');
  const empties = boardState.map((v,i)=>v===null?i:null).filter(v=>v!==null);
  if (!empties.length) return;
  const idx = difficulty === 'hard'
    ? empties[Math.floor(Math.random()*empties.length)]  // can later build minimax
    : empties[Math.floor(Math.random()*empties.length)];
  setTimeout(() => {
    makeMove(idx);
    board.classList.remove('no-click');
  }, 700);
}

function resetBoard() {
  boardState.fill(null);
  cells.forEach(c => c.textContent = '');
}

function resetScores() {
  player1Score = player2Score = draws = 0;
  player1ScoreSpan.textContent = player2ScoreSpan.textContent = drawsCountSpan.textContent = 0;
}

function startGame() {
  player1Name = player1NameInput.value.trim() || 'Player 1';
  player2Name = player2NameInput.value.trim() || (gameModeSelect.value==='pvc'?'Computer':'Player 2');
  player1Choice = player1ChoiceSelect.value;
  gameMode = gameModeSelect.value;
  difficulty = difficultySelect.value;

  player1ScoreName.textContent = player1Name;
  player2ScoreName.textContent = player2Name;

  resetBoard(); resetScores();
  currentPlayer = player1Choice;
  updateCurrentPlayerDisplay();
  startScreen.style.display = 'none';
  gameContainer.style.display = 'block';
  gameActive = true; startTimer();
  if (gameMode==='pvc' && currentPlayer !== player1Choice) computerMove();
}

// Event listeners
document.getElementById('start-game-btn').addEventListener('click', startGame);

gameModeSelect.addEventListener('change', () => {
  difficultySelect.style.display = gameModeSelect.value==='pvc' ? 'inline-block' : 'none';
});

cells.forEach((cell,i) => cell.addEventListener('click', () => {
  if (gameMode === 'pvc' && currentPlayer !== player1Choice) return;
  makeMove(i);
}));

restartBtn.addEventListener('click', () => {
  resetBoard(); gameActive = true;
  currentPlayer = player1Choice;
  updateCurrentPlayerDisplay();
  startTimer();
  if (gameMode==='pvc' && currentPlayer !== player1Choice) computerMove();
});

resetScoresBtn.addEventListener('click', resetScores);
