// =========================================================
//  TOSH - QAYCHI - QOG'OZ   (AI'ga qarshi)
// =========================================================

const CHOICES = {
  rock:     { emoji: '✊', label: 'Tosh',    beats: 'scissors' },
  paper:    { emoji: '✋', label: "Qog'oz",  beats: 'rock' },
  scissors: { emoji: '✌️', label: 'Qaychi',  beats: 'paper' },
};

const playerHandEl = document.getElementById('player-hand');
const aiHandEl      = document.getElementById('ai-hand');
const resultTextEl  = document.getElementById('result-text');
const playerScoreEl = document.getElementById('player-score');
const aiScoreEl      = document.getElementById('ai-score');
const roundCountEl  = document.getElementById('round-count');
const resetBtn       = document.getElementById('reset-btn');
const historyEl      = document.getElementById('history');
const choiceButtons  = document.querySelectorAll('.choice-btn');

let playerScore = 0;
let aiScore = 0;
let round = 0;
let locked = false;

// AI keyingi harakatni tanlashda oxirgi tanlovlarni "o'rganadi" —
// oddiy tasodifdan biroz aqlliroq: agar o'yinchi bir narsani ko'p tanlasa,
// AI unga qarshi javob berish ehtimolini oshiradi.
let playerHistory = [];

function pickAIChoice() {
  if (playerHistory.length < 3) {
    return randomChoice();
  }
  // Oxirgi 3 tanlovdan eng ko'p takrorlanganini top
  const recent = playerHistory.slice(-5);
  const freq = {};
  recent.forEach(c => freq[c] = (freq[c] || 0) + 1);
  const predicted = Object.keys(freq).sort((a,b) => freq[b]-freq[a])[0];

  // 65% ehtimol bilan bashoratga qarshi o'ynaydi, 35% tasodifiy
  if (Math.random() < 0.65) {
    return CHOICES[predicted].beats === predicted ? randomChoice() : counterOf(predicted);
  }
  return randomChoice();
}

function counterOf(choice) {
  // "choice"ni yutadigan tanlovni qaytaradi
  return Object.keys(CHOICES).find(key => CHOICES[key].beats === choice);
}

function randomChoice() {
  const keys = Object.keys(CHOICES);
  return keys[Math.floor(Math.random() * keys.length)];
}

function decideWinner(player, ai) {
  if (player === ai) return 'draw';
  return CHOICES[player].beats === ai ? 'win' : 'lose';
}

choiceButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (locked) return;
    playRound(btn.dataset.choice);
  });
});

resetBtn.addEventListener('click', resetAll);

function playRound(playerChoice) {
  locked = true;
  choiceButtons.forEach(b => b.classList.add('disabled'));

  playerHistory.push(playerChoice);

  // "O'ylayapti" animatsiyasi
  playerHandEl.textContent = CHOICES[playerChoice].emoji;
  playerHandEl.classList.remove('win','lose','draw');
  aiHandEl.textContent = '🤔';
  aiHandEl.classList.remove('win','lose','draw');
  aiHandEl.classList.add('shake');
  resultTextEl.textContent = 'AI O\'YLAYAPTI...';

  setTimeout(() => {
    const aiChoice = pickAIChoice();
    aiHandEl.classList.remove('shake');
    aiHandEl.textContent = CHOICES[aiChoice].emoji;

    const outcome = decideWinner(playerChoice, aiChoice);
    round++;
    roundCountEl.textContent = round;

    if (outcome === 'win') {
      playerScore++;
      resultTextEl.textContent = 'SIZ YUTDINGIZ!';
      playerHandEl.classList.add('win');
      aiHandEl.classList.add('lose');
    } else if (outcome === 'lose') {
      aiScore++;
      resultTextEl.textContent = 'AI YUTDI!';
      playerHandEl.classList.add('lose');
      aiHandEl.classList.add('win');
    } else {
      resultTextEl.textContent = "DURANG!";
      playerHandEl.classList.add('draw');
      aiHandEl.classList.add('draw');
    }

    playerScoreEl.textContent = playerScore;
    aiScoreEl.textContent = aiScore;
    addHistoryDot(outcome);
    resetBtn.classList.remove('hidden');

    setTimeout(() => {
      locked = false;
      choiceButtons.forEach(b => b.classList.remove('disabled'));
    }, 400);
  }, 700);
}

function addHistoryDot(outcome) {
  const dot = document.createElement('div');
  dot.className = 'history-dot ' + outcome;
  dot.textContent = outcome === 'win' ? 'G' : outcome === 'lose' ? 'M' : 'D';
  historyEl.appendChild(dot);
  // faqat oxirgi 20 tasini ko'rsatish
  while (historyEl.children.length > 20) {
    historyEl.removeChild(historyEl.firstChild);
  }
}

function resetAll() {
  playerScore = 0; aiScore = 0; round = 0; playerHistory = [];
  playerScoreEl.textContent = 0;
  aiScoreEl.textContent = 0;
  roundCountEl.textContent = 0;
  playerHandEl.textContent = '❓';
  aiHandEl.textContent = '🤖';
  playerHandEl.classList.remove('win','lose','draw');
  aiHandEl.classList.remove('win','lose','draw');
  resultTextEl.textContent = 'TANLANG';
  historyEl.innerHTML = '';
  resetBtn.classList.add('hidden');
}