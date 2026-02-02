/* ═══════════════════════════════════════════════════════════
   HER DIGITAL WORLD - COMPLETE JAVASCRIPT
   All Interactive Features & Functionality + NEW GAMES
   ═══════════════════════════════════════════════════════════ */

// ===== GLOBAL STATE =====
let visitedSections = new Set();
let currentSection = 'worldMap';
let gratitudeToday = 0;
let currentDreamId = null;

// Game States
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let moveCount = 0;
let tictactoeBoard = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = '❤️';
let gameActive = true;
let hugsToday = 0;

const REQUIRED_SECTIONS = 5;
const USER_NAME = "Beautiful";

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌍 Her Digital World - Initialized');
    initializeApp();
    loadSavedData();
    startDateTime();
    checkDarkMode();
    initializeMemoryGame();
    initializeTicTacToe();
    
    setInterval(startDateTime, 1000);
    setInterval(checkDarkMode, 60000);
});

// ===== APP INITIALIZATION =====
function initializeApp() {
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = USER_NAME;
    }
    
    setDailyQuote();
    updateProgress();
    
    console.log('✨ App initialized successfully');
}

// ===== LOAD SAVED DATA =====
function loadSavedData() {
    const saved = localStorage.getItem('visitedSections');
    if (saved) {
        visitedSections = new Set(JSON.parse(saved));
        updateProgress();
        checkVaultUnlock();
    }
    
    loadDreams();
    
    const today = new Date().toDateString();
    const savedGratitude = localStorage.getItem('gratitudeDate');
    if (savedGratitude === today) {
        gratitudeToday = parseInt(localStorage.getItem('gratitudeCount') || '0');
        const countElement = document.getElementById('gratitudeCount');
        if (countElement) {
            countElement.textContent = gratitudeToday;
        }
    }
    
    // Load hugs
    const savedHugDate = localStorage.getItem('hugDate');
    if (savedHugDate === today) {
        hugsToday = parseInt(localStorage.getItem('hugCount') || '0');
        const hugCountElement = document.getElementById('hugCount');
        if (hugCountElement) {
            hugCountElement.textContent = hugsToday;
        }
    }
}

// ===== DATE & TIME =====
function startDateTime() {
    const now = new Date();
    
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', dateOptions);
    
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true 
    });
    
    const dateElements = document.querySelectorAll('.current-date, #welcomeDate');
    const timeElements = document.querySelectorAll('.current-time, #welcomeTime');
    
    dateElements.forEach(el => el.textContent = dateString);
    timeElements.forEach(el => el.textContent = timeString);
}

// ===== DAILY QUOTE SYSTEM =====
function setDailyQuote() {
    const quotes = [
        "You are exactly where you need to be right now.",
        "Every moment is a fresh beginning.",
        "Your journey is uniquely beautiful.",
        "Believe in yourself as much as I believe in you.",
        "You are growing, even when you can't see it.",
        "Today holds infinite possibilities.",
        "You are stronger than you know.",
        "Your presence makes the world brighter.",
        "Trust the timing of your life.",
        "You are worthy of all good things.",
        "Small steps still move you forward.",
        "You are enough, just as you are.",
        "Your story is still unfolding.",
        "Peace begins with you.",
        "You are loved beyond measure.",
    ];
    
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const quoteIndex = dayOfYear % quotes.length;
    
    const quoteElement = document.getElementById('welcomeQuote');
    if (quoteElement) {
        quoteElement.textContent = `"${quotes[quoteIndex]}"`;
    }
}

// ===== DARK MODE =====
function checkDarkMode() {
    const hour = new Date().getHours();
    
    if (hour >= 22 || hour < 6) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

// ===== NAVIGATION =====
function navigateToSection(sectionId) {
    visitedSections.add(sectionId);
    saveVisitedSections();
    updateProgress();
    checkVaultUnlock();
    
    const sections = document.querySelectorAll('.world-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    setTimeout(() => {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            currentSection = sectionId;
            window.scrollTo(0, 0);
        }
    }, 100);
    
    if (sectionId === 'dreamSky') {
        loadDreams();
    }
}

function goToWorldMap() {
    navigateToSection('worldMap');
}

// ===== PROGRESS TRACKING =====
function saveVisitedSections() {
    localStorage.setItem('visitedSections', JSON.stringify([...visitedSections]));
}

function updateProgress() {
    const totalSections = 7;
    const visited = visitedSections.size;
    const percentage = Math.round((visited / totalSections) * 100);
    
    const progressText = document.getElementById('progressText');
    const progressFill = document.getElementById('progressFill');
    
    if (progressText) {
        progressText.textContent = `${percentage}% Explored`;
    }
    
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
}

// ===== VAULT UNLOCK SYSTEM =====
function checkVaultUnlock() {
    if (visitedSections.size >= REQUIRED_SECTIONS) {
        const vaultIcon = document.getElementById('vaultIcon');
        const vaultDesc = document.getElementById('vaultDesc');
        
        if (vaultIcon) vaultIcon.textContent = '🔓';
        if (vaultDesc) vaultDesc.textContent = 'Unlocked!';
    }
}

function checkSecretVault() {
    if (visitedSections.size >= REQUIRED_SECTIONS) {
        navigateToSection('secretVault');
        showVaultConfetti();
    } else {
        const remaining = REQUIRED_SECTIONS - visitedSections.size;
        alert(`🔒 Secret Vault is locked!\n\nExplore ${remaining} more area${remaining > 1 ? 's' : ''} to unlock this special place.`);
    }
}

function showVaultConfetti() {
    const confettiContainer = document.getElementById('vaultConfetti');
    if (!confettiContainer) return;
    
    confettiContainer.innerHTML = '';
    
    const colors = ['#FFB6C1', '#DDA0DD', '#B0E0E6', '#FFD700', '#C8E6C9'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`;
        confettiContainer.appendChild(confetti);
    }
    
    if (!document.getElementById('confettiStyle')) {
        const style = document.createElement('style');
        style.id = 'confettiStyle';
        style.textContent = `
            @keyframes confettiFall {
                to {
                    transform: translateY(100vh) rotate(${Math.random() * 360}deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== SOUND TOGGLE =====
let soundEnabled = false;

function toggleGlobalSound() {
    soundEnabled = !soundEnabled;
    const icon = document.getElementById('soundIcon');
    
    if (icon) {
        icon.textContent = soundEnabled ? '🔊' : '🔇';
    }
    
    console.log('Sound:', soundEnabled ? 'ON' : 'OFF');
}

// ═══════════════════════════════════════════════════════════
// MEMORY CITY - Timeline & Modals
// ═══════════════════════════════════════════════════════════

const memories = [
    {
        title: "The Beginning",
        date: "A special day",
        content: "This is where it all started. A moment that changed everything. The first spark of something beautiful that would grow into what we have today. Remember how nervous we both were? How exciting it felt? That moment will always be special."
    },
    {
        title: "First Connection",
        date: "An unforgettable moment",
        content: "When everything clicked. That conversation that lasted for hours without either of us noticing time passing. When we realized we could talk about anything and everything. That's when I knew you were someone truly special."
    },
    {
        title: "Laughter & Light",
        date: "A day of joy",
        content: "Pure happiness together. That day when we couldn't stop laughing, when everything felt light and easy and perfect. Those are the moments that remind us why we chose each other, why we keep choosing each other."
    },
    {
        title: "Growing Closer",
        date: "A turning point",
        content: "Deepening bonds. The moment we went from casual to meaningful. When walls came down and hearts opened up. When we trusted each other enough to be vulnerable, to be real, to be ourselves completely."
    },
    {
        title: "Still Writing",
        date: "Today & always",
        content: "Our story continues. Every day is a new page, a new opportunity, a new memory waiting to be made. This isn't the end—it's just the beginning of forever. And I can't wait to see what we write next."
    }
];

function openMemory(index) {
    const memory = memories[index];
    const modal = document.getElementById('memoryModal');
    
    document.getElementById('memoryModalTitle').textContent = memory.title;
    document.getElementById('memoryModalDate').textContent = memory.date;
    document.getElementById('memoryModalBody').innerHTML = `<p style="line-height: 2;">${memory.content}</p>`;
    
    modal.classList.add('show');
}

function closeMemoryModal() {
    document.getElementById('memoryModal').classList.remove('show');
}

// ═══════════════════════════════════════════════════════════
// FEELINGS FOREST - Mood Selector
// ═══════════════════════════════════════════════════════════

const moodMessages = {
    happy: {
        message: "Your happiness lights up the world! 🌟 I love seeing you this way. Keep spreading that joy—it's contagious and beautiful. Remember this feeling, hold onto it, and know that you deserve to feel this good every single day.",
        color: '#FFB6C1'
    },
    calm: {
        message: "There's such strength in your peace. 😌 You've found your center, and that's a beautiful thing. Stay in this moment. Breathe it in. You're exactly where you need to be, feeling exactly what you need to feel.",
        color: '#B0E0E6'
    },
    excited: {
        message: "Your excitement is electric! ⚡ I can feel your energy from here. Whatever you're looking forward to, I hope it's everything you dream it will be and more. You deserve all the good things coming your way.",
        color: '#FFD700'
    },
    thoughtful: {
        message: "Your mind is a beautiful place. 💭 The way you think about things, the depth you bring to everything—it's rare and special. Take your time with your thoughts. They'll lead you where you need to go.",
        color: '#DDA0DD'
    },
    tired: {
        message: "Rest, my dear. 💤 You've been working so hard, giving so much. It's okay to be tired. It's okay to slow down. Take care of yourself. The world can wait—your wellbeing can't. You deserve rest.",
        color: '#C8E6C9'
    },
    sad: {
        message: "It's okay not to be okay. 💙 Your feelings are valid, always. Even in sadness, you're not alone. This feeling will pass, I promise. And when it does, you'll be stronger for having felt it. I'm here with you through it all.",
        color: '#B0E0E6'
    }
};

function selectMood(mood) {
    const moodData = moodMessages[mood];
    const moodMessage = document.getElementById('moodMessage');
    const moodResponse = document.getElementById('moodResponse');
    const shareBtn = document.getElementById('shareMoodBtn');
    
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.mood-btn').classList.add('active');
    
    moodMessage.textContent = moodData.message;
    moodMessage.style.background = moodData.color;
    moodMessage.style.color = '#2c2c2c';
    
    document.getElementById('feelingsForest').style.background = 
        `linear-gradient(135deg, ${moodData.color}22 0%, ${moodData.color}11 100%)`;
    
    shareBtn.style.display = 'inline-block';
    shareBtn.onclick = () => {
        const shareText = `I'm feeling ${mood} today! 💕`;
        if (navigator.share) {
            navigator.share({ text: shareText });
        } else {
            alert('Share: ' + shareText);
        }
    };
}

// ═══════════════════════════════════════════════════════════
// DREAM SKY - Dream Management
// ═══════════════════════════════════════════════════════════

function showDreamInput() {
    document.getElementById('dreamForm').classList.add('show');
    document.getElementById('dreamTextarea').focus();
}

function hideDreamInput() {
    document.getElementById('dreamForm').classList.remove('show');
    document.getElementById('dreamTextarea').value = '';
}

function saveDream() {
    const textarea = document.getElementById('dreamTextarea');
    const dreamText = textarea.value.trim();
    
    if (!dreamText) {
        alert('✨ Please write your dream first!');
        return;
    }
    
    let dreams = JSON.parse(localStorage.getItem('dreams') || '[]');
    
    const newDream = {
        id: Date.now(),
        text: dreamText,
        date: new Date().toLocaleDateString(),
        position: {
            top: Math.random() * 70 + 10,
            left: Math.random() * 80 + 10
        }
    };
    
    dreams.push(newDream);
    localStorage.setItem('dreams', JSON.stringify(dreams));
    
    textarea.value = '';
    hideDreamInput();
    
    loadDreams();
}

function loadDreams() {
    const dreams = JSON.parse(localStorage.getItem('dreams') || '[]');
    const canvas = document.getElementById('dreamSkyCanvas');
    const emptyMessage = document.getElementById('dreamEmptyMessage');
    
    if (!canvas) return;
    
    canvas.innerHTML = '';
    
    if (dreams.length === 0) {
        if (emptyMessage) emptyMessage.style.display = 'block';
        return;
    }
    
    if (emptyMessage) emptyMessage.style.display = 'none';
    
    dreams.forEach(dream => {
        const star = document.createElement('div');
        star.className = 'dream-star';
        star.textContent = '⭐';
        star.style.top = dream.position.top + '%';
        star.style.left = dream.position.left + '%';
        star.style.fontSize = '2rem';
        star.onclick = () => openDream(dream.id);
        canvas.appendChild(star);
    });
}

function openDream(dreamId) {
    const dreams = JSON.parse(localStorage.getItem('dreams') || '[]');
    const dream = dreams.find(d => d.id === dreamId);
    
    if (!dream) return;
    
    currentDreamId = dreamId;
    
    document.getElementById('dreamModalText').textContent = dream.text;
    document.getElementById('dreamModalDate').textContent = `Dreamed on ${dream.date}`;
    document.getElementById('dreamModal').classList.add('show');
}

function closeDreamModal() {
    document.getElementById('dreamModal').classList.remove('show');
    currentDreamId = null;
}

function deleteDreamFromModal() {
    if (!currentDreamId) return;
    
    if (confirm('Delete this dream? ⭐')) {
        let dreams = JSON.parse(localStorage.getItem('dreams') || '[]');
        dreams = dreams.filter(d => d.id !== currentDreamId);
        localStorage.setItem('dreams', JSON.stringify(dreams));
        
        closeDreamModal();
        loadDreams();
    }
}

// ═══════════════════════════════════════════════════════════
// CALM OCEAN - Breathing Exercise
// ═══════════════════════════════════════════════════════════

let breathingActive = false;

function startBreathing() {
    breathingActive = !breathingActive;
    
    const circle = document.getElementById('breathingCircle');
    const text = document.getElementById('breathingText');
    const instruction = document.getElementById('breathingInstruction');
    
    if (breathingActive) {
        circle.classList.add('active');
        
        const breathingCycle = ['Breathe In', 'Hold', 'Breathe Out', 'Hold'];
        let cycleIndex = 0;
        
        const breathingInterval = setInterval(() => {
            if (!breathingActive) {
                clearInterval(breathingInterval);
                text.textContent = 'Breathe';
                instruction.textContent = 'Follow the circle. Breathe slowly.';
                return;
            }
            
            text.textContent = breathingCycle[cycleIndex];
            cycleIndex = (cycleIndex + 1) % breathingCycle.length;
        }, 4000);
        
        instruction.textContent = 'Breathing exercise in progress...';
    } else {
        circle.classList.remove('active');
        text.textContent = 'Breathe';
        instruction.textContent = 'Follow the circle. Breathe slowly.';
    }
}

// ═══════════════════════════════════════════════════════════
// FUN CORNER - Interactive Widgets
// ═══════════════════════════════════════════════════════════

// Compliment Generator
const compliments = [
    "Your smile could light up the darkest room! 🌟",
    "You have a heart of pure gold! 💛",
    "The world is better with you in it! 🌍",
    "Your kindness is a superpower! 💫",
    "You make everything more beautiful! 🌸",
    "Your strength inspires everyone around you! 💪",
    "You're absolutely amazing, inside and out! ✨",
    "Your laughter is the best sound in the world! 🎵",
    "You have the most beautiful soul! 🦋",
    "You're one of a kind—irreplaceable! 💎",
    "Your presence makes everything better! 🌈",
    "You're braver than you believe! 🦁",
    "Your energy is contagious in the best way! ⚡",
    "You deserve all the happiness in the world! 🎈",
    "You're a masterpiece! 🎨"
];

function generateCompliment() {
    const display = document.getElementById('complimentDisplay');
    const randomIndex = Math.floor(Math.random() * compliments.length);
    
    display.style.opacity = '0';
    
    setTimeout(() => {
        display.textContent = compliments[randomIndex];
        display.style.opacity = '1';
        display.style.transition = 'opacity 0.5s ease';
    }, 200);
}

// ═══════════════════════════════════════════════════════════
// MEMORY MATCH GAME
// ═══════════════════════════════════════════════════════════

function initializeMemoryGame() {
    const emojis = ['💖', '🌸', '🌟', '🦋', '🌈', '✨', '💕', '🌺'];
    const gameEmojis = [...emojis, ...emojis];
    memoryCards = gameEmojis.sort(() => Math.random() - 0.5);
    
    const grid = document.getElementById('memoryGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    memoryCards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = index;
        card.dataset.emoji = emoji;
        card.innerHTML = '<div class="card-back">?</div><div class="card-front">' + emoji + '</div>';
        card.onclick = () => flipCard(index);
        grid.appendChild(card);
    });
    
    flippedCards = [];
    matchedPairs = 0;
    moveCount = 0;
    updateGameStats();
}

function flipCard(index) {
    const card = document.querySelector(`[data-index="${index}"]`);
    
    if (card.classList.contains('flipped') || card.classList.contains('matched') || flippedCards.length === 2) {
        return;
    }
    
    card.classList.add('flipped');
    flippedCards.push({ index, emoji: card.dataset.emoji, element: card });
    
    if (flippedCards.length === 2) {
        moveCount++;
        updateGameStats();
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.emoji === card2.emoji) {
        setTimeout(() => {
            card1.element.classList.add('matched');
            card2.element.classList.add('matched');
            matchedPairs++;
            updateGameStats();
            flippedCards = [];
            
            if (matchedPairs === 8) {
                setTimeout(() => {
                    alert('🎉 Congratulations! You matched all pairs!');
                }, 500);
            }
        }, 500);
    } else {
        setTimeout(() => {
            card1.element.classList.remove('flipped');
            card2.element.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

function updateGameStats() {
    const moveCountEl = document.getElementById('moveCount');
    const matchCountEl = document.getElementById('matchCount');
    
    if (moveCountEl) moveCountEl.textContent = moveCount;
    if (matchCountEl) matchCountEl.textContent = `${matchedPairs}/8`;
}

function resetMemoryGame() {
    initializeMemoryGame();
}

// ═══════════════════════════════════════════════════════════
// TIC TAC TOE GAME
// ═══════════════════════════════════════════════════════════

function initializeTicTacToe() {
    const grid = document.getElementById('tictactoeGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    tictactoeBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = '❤️';
    gameActive = true;
    
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'tictactoe-cell';
        cell.dataset.index = i;
        cell.onclick = () => makeMove(i);
        grid.appendChild(cell);
    }
    
    updateTicTacToeStatus('Your turn! (❤️)');
}

function makeMove(index) {
    if (!gameActive || tictactoeBoard[index] !== '') return;
    
    tictactoeBoard[index] = currentPlayer;
    const cell = document.querySelector(`#tictactoeGrid .tictactoe-cell[data-index="${index}"]`);
    cell.textContent = currentPlayer;
    cell.classList.add('taken');
    
    if (checkWinner()) {
        updateTicTacToeStatus(`${currentPlayer} wins! 🎉`);
        gameActive = false;
        return;
    }
    
    if (tictactoeBoard.every(cell => cell !== '')) {
        updateTicTacToeStatus("It's a tie! 🤝");
        gameActive = false;
        return;
    }
    
    currentPlayer = currentPlayer === '❤️' ? '💙' : '❤️';
    updateTicTacToeStatus(`${currentPlayer}'s turn!`);
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    
    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return tictactoeBoard[a] && 
               tictactoeBoard[a] === tictactoeBoard[b] && 
               tictactoeBoard[a] === tictactoeBoard[c];
    });
}

function updateTicTacToeStatus(message) {
    const status = document.getElementById('tictactoeStatus');
    if (status) status.textContent = message;
}

function resetTicTacToe() {
    initializeTicTacToe();
}

// ═══════════════════════════════════════════════════════════
// FORTUNE COOKIE
// ═══════════════════════════════════════════════════════════

const fortunes = [
    "Something wonderful is about to happen to you! ✨",
    "Your kindness will be returned to you tenfold 💝",
    "A beautiful surprise awaits you soon 🎁",
    "Today is your day to shine bright! 🌟",
    "Love and joy are heading your way 💕",
    "Your dreams are closer than you think ⭐",
    "Good things come to those who stay true to themselves 🌸",
    "The best is yet to come! 🌈",
    "You are on the right path 🦋",
    "Happiness is knocking at your door 🚪",
    "Your positive energy will attract amazing things ⚡",
    "A wonderful adventure awaits you 🗺️",
    "You will find joy in unexpected places 🌺",
    "Your smile will brighten someone's day today 😊",
    "Great success is in your future! 🏆"
];

function crackFortune() {
    const cookie = document.getElementById('fortuneCookie');
    const message = document.getElementById('fortuneMessage');
    
    cookie.classList.add('cracked');
    
    setTimeout(() => {
        const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
        message.textContent = randomFortune;
        message.style.opacity = '1';
        
        setTimeout(() => {
            cookie.classList.remove('cracked');
            message.style.opacity = '0';
        }, 5000);
    }, 500);
}

// ═══════════════════════════════════════════════════════════
// LOVE CALCULATOR
// ═══════════════════════════════════════════════════════════

function calculateLove() {
    const name1 = document.getElementById('name1').value.trim();
    const name2 = document.getElementById('name2').value.trim();
    const result = document.getElementById('loveResult');
    
    if (!name1 || !name2) {
        alert('Please enter both names! 💕');
        return;
    }
    
    const combined = (name1 + name2).toLowerCase();
    let sum = 0;
    for (let i = 0; i < combined.length; i++) {
        sum += combined.charCodeAt(i);
    }
    
    const percentage = (sum % 40) + 60;
    
    let message = '';
    if (percentage >= 90) {
        message = 'Perfect match! Made for each other! 💖';
    } else if (percentage >= 75) {
        message = 'Amazing connection! So much love! 💕';
    } else if (percentage >= 60) {
        message = 'Great compatibility! Sweet and lovely! 💝';
    }
    
    result.innerHTML = `
        <div class="love-percentage">${percentage}%</div>
        <div class="love-message">${message}</div>
        <div class="love-hearts">💖 ${'💕'.repeat(Math.floor(percentage / 20))} 💖</div>
    `;
    result.style.opacity = '1';
}

// ═══════════════════════════════════════════════════════════
// EMOJI GARDEN
// ═══════════════════════════════════════════════════════════

const gardenEmojis = ['🌸', '🌺', '🌼', '🌻', '🌷', '🌹', '💐', '🏵️', '🌴', '🌵'];

document.addEventListener('DOMContentLoaded', function() {
    const emojiField = document.getElementById('emojiField');
    
    if (emojiField) {
        emojiField.addEventListener('click', function(e) {
            const emoji = document.createElement('div');
            emoji.className = 'emoji-planted';
            emoji.textContent = gardenEmojis[Math.floor(Math.random() * gardenEmojis.length)];
            
            const rect = emojiField.getBoundingClientRect();
            emoji.style.left = (e.clientX - rect.left) + 'px';
            emoji.style.top = (e.clientY - rect.top) + 'px';
            
            emojiField.appendChild(emoji);
        });
    }
});

function clearEmojis() {
    const emojiField = document.getElementById('emojiField');
    if (emojiField) {
        emojiField.innerHTML = '';
    }
}

// ═══════════════════════════════════════════════════════════
// GRATITUDE COUNTER
// ═══════════════════════════════════════════════════════════

function incrementGratitude() {
    gratitudeToday++;
    const today = new Date().toDateString();
    
    localStorage.setItem('gratitudeCount', gratitudeToday.toString());
    localStorage.setItem('gratitudeDate', today);
    
    const countElement = document.getElementById('gratitudeCount');
    if (countElement) {
        countElement.textContent = gratitudeToday;
    }
    
    createMiniConfetti();
}

function createMiniConfetti() {
    const container = document.getElementById('funConfetti');
    if (!container) return;
    
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '8px';
        confetti.style.height = '8px';
        confetti.style.background = ['#FFB6C1', '#DDA0DD', '#FFD700'][Math.floor(Math.random() * 3)];
        confetti.style.left = '50%';
        confetti.style.top = '50%';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.animation = 'confettiBurst 1s ease-out forwards';
        confetti.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;
        container.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 1000);
    }
    
    if (!document.getElementById('burstStyle')) {
        const style = document.createElement('style');
        style.id = 'burstStyle';
        style.textContent = `
            @keyframes confettiBurst {
                to {
                    transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ═══════════════════════════════════════════════════════════
// COLOR MOOD PAINTER
// ═══════════════════════════════════════════════════════════

function paintMood(color, feeling) {
    const result = document.getElementById('moodColorResult');
    result.style.background = color;
    result.style.color = '#2c2c2c';
    result.textContent = `You're feeling ${feeling} right now! 💕`;
    result.style.opacity = '0';
    
    setTimeout(() => {
        result.style.opacity = '1';
        result.style.transition = 'opacity 0.5s ease';
    }, 100);
}

// ═══════════════════════════════════════════════════════════
// VIRTUAL HUG SENDER
// ═══════════════════════════════════════════════════════════

function sendHug() {
    hugsToday++;
    const today = new Date().toDateString();
    
    localStorage.setItem('hugCount', hugsToday.toString());
    localStorage.setItem('hugDate', today);
    
    const hugCountElement = document.getElementById('hugCount');
    if (hugCountElement) {
        hugCountElement.textContent = hugsToday;
    }
    
    // Create hug animation
    const animation = document.getElementById('hugAnimation');
    if (animation) {
        const hug = document.createElement('div');
        hug.className = 'floating-hug';
        hug.textContent = '🤗';
        hug.style.left = Math.random() * 80 + 10 + '%';
        animation.appendChild(hug);
        
        setTimeout(() => hug.remove(), 3000);
    }
}

// ═══════════════════════════════════════════════════════════
// KEYBOARD SHORTCUTS & ACCESSIBILITY
// ═══════════════════════════════════════════════════════════

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeMemoryModal();
        closeDreamModal();
    }
    
    if (e.key === 'h' && !e.target.matches('input, textarea')) {
        goToWorldMap();
    }
});

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        closeMemoryModal();
        closeDreamModal();
    }
});

console.log('✨ Her Digital World is ready');
console.log('💝 Made with love');