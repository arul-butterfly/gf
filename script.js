// ==========================================
// CONFIGURATION - EASY TO EDIT
// ==========================================

const CONFIG = {
    herName: "Her", // Change this to her actual name
    secretCode: "iloveyou", // Secret code to unlock surprise room
    chatName: "My Love" // Name displayed in chat
};

// ==========================================
// GLOBAL VARIABLES
// ==========================================

let currentPage = 'home';
let musicPlaying = false;
let surpriseUnlocked = false;

// Quiz variables
let currentQuizQuestion = 0;
let quizScore = 0;

// Memory game variables
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;

// Catch heart game variables
let catchScore = 0;
let catchTimer = 30;
let catchGameActive = false;
let catchInterval;
let heartInterval;

// Wheel variables
let isSpinning = false;

// Story variables
let currentStory = 0;

// Chat variables
let chatStep = 0;

// Slideshow variables
let currentSlide = 0;

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Set her name
    document.getElementById('herName').textContent = CONFIG.herName;
    document.getElementById('chatName').textContent = CONFIG.chatName;
    
    // Initialize music toggle
    initMusicToggle();
    
    // Initialize daily content
    generateCompliment();
    generateQuestion();
    generateMemory();
    generateQuote();
    
    // Initialize story
    startStory();
    
    // Initialize chat
    startChat();
    
    // Draw wheel
    drawWheel();
});

// ==========================================
// MUSIC CONTROL
// ==========================================

function initMusicToggle() {
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    
    musicToggle.addEventListener('click', function() {
        if (musicPlaying) {
            bgMusic.pause();
            musicToggle.classList.add('muted');
            musicPlaying = false;
        } else {
            bgMusic.play().catch(e => console.log('Music play failed:', e));
            musicToggle.classList.remove('muted');
            musicPlaying = true;
        }
    });
}

// ==========================================
// PAGE NAVIGATION
// ==========================================

function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
        currentPage = pageId;
    }
    
    // Show/hide navbar
    const navbar = document.getElementById('navbar');
    if (pageId === 'home') {
        navbar.classList.add('hidden');
    } else {
        navbar.classList.remove('hidden');
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
}

function showGame(gameId) {
    showPage(gameId);
    
    // Initialize specific games
    if (gameId === 'loveQuiz') {
        startQuiz();
    } else if (gameId === 'memoryGame') {
        initMemoryGame();
    }
}

function enterWorld() {
    showPage('games');
    
    // Try to play music
    const bgMusic = document.getElementById('bgMusic');
    bgMusic.play().then(() => {
        musicPlaying = true;
        document.getElementById('musicToggle').classList.remove('muted');
    }).catch(e => {
        console.log('Autoplay prevented. User can click music button.');
    });
}

// ==========================================
// LOVE QUIZ GAME
// ==========================================

const quizQuestions = [
    {
        question: "What makes our relationship special? 💕",
        options: [
            "The way we laugh together",
            "How we understand each other",
            "All the little moments we share",
            "All of the above ❤️"
        ],
        correct: 3
    },
    {
        question: "What's the best thing about being together? 🌟",
        options: [
            "Never feeling alone",
            "Having someone who truly gets me",
            "Making amazing memories",
            "All of these! 💖"
        ],
        correct: 3
    },
    {
        question: "How do I make you smile? 😊",
        options: [
            "With my silly jokes",
            "Just by being there",
            "Surprises and sweet gestures",
            "Everything you do! ✨"
        ],
        correct: 3
    },
    {
        question: "What's our favorite thing to do together? 🎉",
        options: [
            "Talk for hours about everything",
            "Go on adventures",
            "Just being cozy together",
            "I love it all! 💕"
        ],
        correct: 3
    },
    {
        question: "Complete this: You are my... 💝",
        options: [
            "Sunshine on cloudy days",
            "Favorite person in the world",
            "Greatest adventure",
            "Everything 🌈"
        ],
        correct: 3
    }
];

function startQuiz() {
    currentQuizQuestion = 0;
    quizScore = 0;
    document.getElementById('quizResult').classList.add('hidden');
    showQuizQuestion();
}

function showQuizQuestion() {
    const question = quizQuestions[currentQuizQuestion];
    const questionEl = document.getElementById('quizQuestion');
    const optionsEl = document.getElementById('quizOptions');
    
    questionEl.textContent = `Question ${currentQuizQuestion + 1}: ${question.question}`;
    
    optionsEl.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'quiz-option';
        optionDiv.textContent = option;
        optionDiv.onclick = () => selectQuizAnswer(index);
        optionsEl.appendChild(optionDiv);
    });
}

function selectQuizAnswer(selectedIndex) {
    const question = quizQuestions[currentQuizQuestion];
    
    if (selectedIndex === question.correct) {
        quizScore++;
    }
    
    currentQuizQuestion++;
    
    if (currentQuizQuestion < quizQuestions.length) {
        showQuizQuestion();
    } else {
        showQuizResult();
    }
}

function showQuizResult() {
    document.getElementById('quizQuestion').textContent = '';
    document.getElementById('quizOptions').innerHTML = '';
    
    const resultEl = document.getElementById('quizResult');
    resultEl.classList.remove('hidden');
    
    let message = '';
    if (quizScore === quizQuestions.length) {
        message = `🎉 Perfect Score! 🎉<br>You got ${quizScore}/${quizQuestions.length}!<br>You know our love so well! 💕`;
    } else if (quizScore >= 3) {
        message = `✨ Amazing! ✨<br>You got ${quizScore}/${quizQuestions.length}!<br>Our connection is so strong! 💖`;
    } else {
        message = `💕 Sweet! 💕<br>You got ${quizScore}/${quizQuestions.length}!<br>Every moment with you is perfect! 🌟`;
    }
    
    resultEl.innerHTML = `
        <h2>${message}</h2>
        <button class="cta-button" onclick="startQuiz()">Play Again 🔄</button>
        <button class="cta-button" onclick="showPage('games')" style="margin-left: 10px;">Back to Games</button>
    `;
}

// ==========================================
// MEMORY GAME
// ==========================================

const memoryEmojis = ['💕', '💖', '💗', '💝', '💞', '💓', '❤️', '🌹'];

function initMemoryGame() {
    matchedPairs = 0;
    moves = 0;
    flippedCards = [];
    memoryCards = [];
    
    document.getElementById('moves').textContent = moves;
    document.getElementById('matches').textContent = matchedPairs;
    document.getElementById('memoryWin').classList.add('hidden');
    
    // Create card pairs
    const cardPairs = [...memoryEmojis, ...memoryEmojis];
    cardPairs.sort(() => Math.random() - 0.5);
    
    // Create board
    const board = document.getElementById('memoryBoard');
    board.innerHTML = '';
    
    cardPairs.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        card.textContent = emoji;
        card.onclick = () => flipCard(card);
        board.appendChild(card);
        memoryCards.push(card);
    });
}

function flipCard(card) {
    // Prevent flipping if already flipped or matched
    if (card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    // Prevent flipping more than 2 cards
    if (flippedCards.length >= 2) {
        return;
    }
    
    card.classList.add('flipped');
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('moves').textContent = moves;
        checkMatch();
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (card1.dataset.emoji === card2.dataset.emoji) {
        // Match found
        card1.classList.add('matched');
        card2.classList.add('matched');
        flippedCards = [];
        matchedPairs++;
        document.getElementById('matches').textContent = matchedPairs;
        
        if (matchedPairs === memoryEmojis.length) {
            setTimeout(() => {
                document.getElementById('memoryWin').classList.remove('hidden');
                createConfetti();
            }, 500);
        }
    } else {
        // No match
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

// ==========================================
// CATCH HEART GAME
// ==========================================

function startCatchGame() {
    if (catchGameActive) return;
    
    catchScore = 0;
    catchTimer = 30;
    catchGameActive = true;
    
    document.getElementById('heartScore').textContent = catchScore;
    document.getElementById('heartTimer').textContent = catchTimer;
    document.getElementById('catchResult').classList.add('hidden');
    document.getElementById('startCatchGame').disabled = true;
    document.getElementById('catchGameArea').innerHTML = '';
    
    // Start timer
    catchInterval = setInterval(() => {
        catchTimer--;
        document.getElementById('heartTimer').textContent = catchTimer;
        
        if (catchTimer <= 0) {
            endCatchGame();
        }
    }, 1000);
    
    // Spawn hearts
    heartInterval = setInterval(spawnHeart, 800);
}

function spawnHeart() {
    const gameArea = document.getElementById('catchGameArea');
    const heart = document.createElement('div');
    
    const isBroken = Math.random() < 0.2; // 20% chance of broken heart
    heart.className = 'falling-heart' + (isBroken ? ' broken' : '');
    heart.textContent = isBroken ? '💔' : '💖';
    heart.style.left = Math.random() * (gameArea.offsetWidth - 40) + 'px';
    
    heart.onclick = () => {
        if (isBroken) {
            catchScore = Math.max(0, catchScore - 2);
        } else {
            catchScore += 1;
        }
        document.getElementById('heartScore').textContent = catchScore;
        heart.remove();
    };
    
    gameArea.appendChild(heart);
    
    setTimeout(() => {
        if (heart.parentElement) {
            heart.remove();
        }
    }, 3000);
}

function endCatchGame() {
    catchGameActive = false;
    clearInterval(catchInterval);
    clearInterval(heartInterval);
    document.getElementById('startCatchGame').disabled = false;
    document.getElementById('catchGameArea').innerHTML = '';
    
    const resultEl = document.getElementById('catchResult');
    resultEl.classList.remove('hidden');
    
    let message = '';
    if (catchScore >= 30) {
        message = `🎉 Incredible! You caught ${catchScore} hearts! 💖`;
    } else if (catchScore >= 20) {
        message = `✨ Great job! You caught ${catchScore} hearts! 💕`;
    } else {
        message = `💕 Sweet effort! You caught ${catchScore} hearts! 🌟`;
    }
    
    resultEl.innerHTML = `<h2>${message}</h2>`;
}

// ==========================================
// LOVE WHEEL
// ==========================================

const wheelPrizes = [
    "Free Hug 🤗",
    "Movie Night 🎬",
    "Chocolate Treat 🍫",
    "Surprise Call 📞",
    "Dinner Date 🍽️",
    "Love Letter 💌",
    "Cuddle Time 🥰",
    "Your Choice! 🎁"
];

function drawWheel() {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 180;
    
    const numSegments = wheelPrizes.length;
    const anglePerSegment = (2 * Math.PI) / numSegments;
    
    wheelPrizes.forEach((prize, index) => {
        const startAngle = index * anglePerSegment;
        const endAngle = startAngle + anglePerSegment;
        
        // Draw segment
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();
        
        // Alternate colors
        ctx.fillStyle = index % 2 === 0 ? '#ff6b9d' : '#c44569';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw text
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + anglePerSegment / 2);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Poppins';
        ctx.fillText(prize, radius / 1.5, 5);
        ctx.restore();
    });
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#ff6b9d';
    ctx.lineWidth = 3;
    ctx.stroke();
}

function spinWheel() {
    if (isSpinning) return;
    
    isSpinning = true;
    document.getElementById('spinBtn').disabled = true;
    document.getElementById('wheelResult').textContent = '';
    
    const canvas = document.getElementById('wheelCanvas');
    const numSegments = wheelPrizes.length;
    const anglePerSegment = 360 / numSegments;
    
    // Random prize
    const prizeIndex = Math.floor(Math.random() * numSegments);
    const finalAngle = 360 * 5 + (prizeIndex * anglePerSegment) + (anglePerSegment / 2);
    
    let currentAngle = 0;
    const spinDuration = 3000;
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        currentAngle = finalAngle * easeOut;
        
        canvas.style.transform = `rotate(${currentAngle}deg)`;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            document.getElementById('spinBtn').disabled = false;
            document.getElementById('wheelResult').innerHTML = 
                `🎉 You won: <strong>${wheelPrizes[prizeIndex]}</strong> 🎉`;
        }
    }
    
    animate();
}

// ==========================================
// INTERACTIVE STORY
// ==========================================

const storyData = {
    start: {
        text: "You're planning a surprise for someone special. What do you do first?",
        choices: [
            { text: "Plan an adventure 🗺️", next: "adventure" },
            { text: "Cook their favorite meal 🍳", next: "cooking" }
        ]
    },
    adventure: {
        text: "You decide to take them somewhere special. Where do you go?",
        choices: [
            { text: "A romantic sunset spot 🌅", next: "sunset" },
            { text: "A cozy café with live music 🎵", next: "cafe" }
        ]
    },
    cooking: {
        text: "You're in the kitchen preparing something delicious. What happens next?",
        choices: [
            { text: "Everything turns out perfect! ✨", next: "perfect_meal" },
            { text: "A small cooking disaster... but it's cute! 😅", next: "disaster" }
        ]
    },
    sunset: {
        text: "You both watch the sunset together, the colors painting the sky. They turn to you and smile...",
        choices: [
            { text: "You tell them how much they mean to you 💕", next: "ending_sweet" }
        ]
    },
    cafe: {
        text: "The music plays softly as you share coffee and conversation. The moment feels perfect...",
        choices: [
            { text: "You ask them to dance 💃", next: "ending_dance" }
        ]
    },
    perfect_meal: {
        text: "Dinner is ready! Everything looks amazing. You sit down together and...",
        choices: [
            { text: "Share stories and laughter all night 🌙", next: "ending_dinner" }
        ]
    },
    disaster: {
        text: "The food didn't turn out as planned, but you both laugh about it. Then you decide to...",
        choices: [
            { text: "Order pizza and make it a fun night anyway! 🍕", next: "ending_pizza" }
        ]
    },
    ending_sweet: {
        text: "Under the colorful sky, you tell them exactly how you feel. Their eyes light up, and in that moment, you both know this is just the beginning of something beautiful. 💖\n\nTHE END",
        choices: []
    },
    ending_dance: {
        text: "You take their hand and sway to the music. In that cozy café, surrounded by soft melodies, you create a memory that will last forever. 💕\n\nTHE END",
        choices: []
    },
    ending_dinner: {
        text: "Hours pass like minutes as you talk, laugh, and share dreams. The perfect meal becomes the perfect night, and you realize that home is wherever you're together. 🏠❤️\n\nTHE END",
        choices: []
    },
    ending_pizza: {
        text: "Sometimes the best moments are unplanned. Sitting on the floor with pizza boxes, laughing at the chaos, you realize that it's not about perfection—it's about being together. 🍕💕\n\nTHE END",
        choices: []
    }
};

function startStory() {
    currentStory = 'start';
    showStoryScene('start');
}

function showStoryScene(sceneKey) {
    const scene = storyData[sceneKey];
    const textEl = document.getElementById('storyText');
    const choicesEl = document.getElementById('storyChoices');
    const restartBtn = document.getElementById('restartStory');
    
    textEl.textContent = scene.text;
    choicesEl.innerHTML = '';
    
    if (scene.choices.length === 0) {
        // Ending reached
        restartBtn.classList.remove('hidden');
    } else {
        restartBtn.classList.add('hidden');
        scene.choices.forEach(choice => {
            const btn = document.createElement('div');
            btn.className = 'story-choice';
            btn.textContent = choice.text;
            btn.onclick = () => showStoryScene(choice.next);
            choicesEl.appendChild(btn);
        });
    }
}

// ==========================================
// SURPRISE ROOM
// ==========================================

function checkSecretCode() {
    const input = document.getElementById('secretCode').value.toLowerCase().trim();
    if (input === CONFIG.secretCode) {
        unlockSurprise();
    } else {
        alert('Wrong code! Try again... 💕');
    }
}

function unlockSurprise() {
    surpriseUnlocked = true;
    document.getElementById('surpriseLocked').classList.add('hidden');
    document.getElementById('surpriseUnlocked').classList.remove('hidden');
    createConfetti();
}

function createConfetti() {
    const container = document.querySelector('.confetti-container');
    if (!container) return;
    
    const colors = ['#ff6b9d', '#c44569', '#ffa07a', '#a55eea'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.opacity = Math.random();
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        container.appendChild(confetti);
        
        const duration = Math.random() * 3 + 2;
        const fallDistance = Math.random() * 100 + 100;
        
        confetti.animate([
            { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
            { transform: `translateY(${fallDistance}vh) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        setTimeout(() => confetti.remove(), duration * 1000);
    }
}

// Slideshow functions
function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    slides[currentSlide].classList.remove('active');
    
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
}

// ==========================================
// MEME PAGE
// ==========================================

const memeData = {
    miss: {
        text: "When you're thinking about me... I'm thinking about you too! 💕",
        sound: true
    },
    reply: {
        text: "Patience, my love! I'm probably just daydreaming about us! 😊",
        sound: true
    },
    fight: {
        text: "Our 'fights' last 5 minutes because we can't stay mad at each other! 😄",
        sound: true
    },
    food: {
        text: "Food tastes better when we're together! Especially dessert! 🍰",
        sound: true
    },
    cute: {
        text: "You're always cute, even when you're trying to be serious! 🥰",
        sound: true
    },
    sleepy: {
        text: "Sleepy you is the cutest you! Sweet dreams! 😴💤",
        sound: true
    }
};

function showMeme(memeType) {
    const meme = memeData[memeType];
    document.getElementById('memeText').textContent = meme.text;
    document.getElementById('memeDisplay').classList.remove('hidden');
    
    if (meme.sound) {
        playSound();
    }
}

function closeMeme() {
    document.getElementById('memeDisplay').classList.add('hidden');
}

function playSound() {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

// ==========================================
// CHAT GAME
// ==========================================

const chatScript = [
    {
        sender: 'received',
        message: 'Hey! 💕',
        delay: 500
    },
    {
        sender: 'received',
        message: 'I was just thinking about you...',
        delay: 1500
    },
    {
        choices: [
            { text: 'I was thinking about you too! 😊', next: 1 },
            { text: 'Really? What were you thinking? 💭', next: 2 }
        ]
    },
    // Path 1
    {
        sender: 'received',
        message: 'We must have some kind of telepathy! 🔮',
        delay: 1000,
        next: 3
    },
    // Path 2
    {
        sender: 'received',
        message: 'About how lucky I am to have you in my life ❤️',
        delay: 1000,
        next: 3
    },
    // Continues
    {
        sender: 'received',
        message: 'Want to know a secret? 🤫',
        delay: 1000,
        choices: [
            { text: 'Tell me! 😊', next: 4 },
            { text: 'Always! 💕', next: 4 }
        ]
    },
    {
        sender: 'received',
        message: 'You make every day brighter just by being you ✨',
        delay: 1500,
        next: 5
    },
    {
        sender: 'received',
        message: 'I love you! 💖',
        delay: 1000,
        final: true
    }
];

function startChat() {
    chatStep = 0;
    document.getElementById('chatMessages').innerHTML = '';
    document.getElementById('chatChoices').innerHTML = '';
    processChatStep(0);
}

function processChatStep(stepIndex) {
    const step = chatScript[stepIndex];
    
    if (step.sender) {
        // Show message
        showTypingIndicator();
        setTimeout(() => {
            hideTypingIndicator();
            addChatMessage(step.message, step.sender);
            
            if (step.choices) {
                showChatChoices(step.choices);
            } else if (step.next !== undefined) {
                setTimeout(() => processChatStep(step.next), 1000);
            }
        }, step.delay || 1000);
    } else if (step.choices) {
        showChatChoices(step.choices);
    }
}

function addChatMessage(text, type) {
    const messagesDiv = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = text;
    
    messageDiv.appendChild(bubble);
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function showChatChoices(choices) {
    const choicesDiv = document.getElementById('chatChoices');
    choicesDiv.innerHTML = '';
    
    choices.forEach(choice => {
        const btn = document.createElement('div');
        btn.className = 'chat-choice';
        btn.textContent = choice.text;
        btn.onclick = () => selectChatChoice(choice);
        choicesDiv.appendChild(btn);
    });
}

function selectChatChoice(choice) {
    addChatMessage(choice.text, 'sent');
    document.getElementById('chatChoices').innerHTML = '';
    
    setTimeout(() => {
        processChatStep(choice.next);
    }, 500);
}

function showTypingIndicator() {
    document.getElementById('typingIndicator').classList.remove('hidden');
}

function hideTypingIndicator() {
    document.getElementById('typingIndicator').classList.add('hidden');
}

// ==========================================
// DAILY FUN PAGE
// ==========================================

const compliments = [
    "Your smile lights up my entire world! 🌟",
    "You're the most beautiful person, inside and out! 💖",
    "Your kindness makes everything better! ✨",
    "I love how you make me laugh every day! 😄",
    "You're absolutely amazing in every way! 💕",
    "Your presence makes every moment special! 🌈",
    "You have the most incredible heart! 💝",
    "Everything is better when you're around! 🌸"
];

const questions = [
    "If you could travel anywhere with me, where would we go? 🗺️",
    "What's your favorite memory of us? 💭",
    "What makes you happiest when we're together? 😊",
    "If we could do anything today, what would it be? 🎯",
    "What's one thing you want to try together? 🌟",
    "What song reminds you of us? 🎵",
    "What's your dream date with me? 💕"
];

const memories = [
    "Remember that time we couldn't stop laughing? 😂",
    "That perfect moment when everything just clicked ✨",
    "When we stayed up talking until sunrise 🌅",
    "That spontaneous adventure we went on 🗺️",
    "When we cooked together and made a mess 🍳",
    "That cozy rainy day we spent inside ☔",
    "Our first inside joke that still makes us laugh 😄"
];

const quotes = [
    "In you, I've found the love of my life and my closest friend. 💕",
    "Every love story is beautiful, but ours is my favorite. 📖",
    "You are my today and all of my tomorrows. 🌟",
    "Together is my favorite place to be. 🏠",
    "You make my heart smile. 😊💖",
    "With you, I am home. 🏡❤️",
    "You're my favorite notification. 📱💕"
];

function generateCompliment() {
    const random = Math.floor(Math.random() * compliments.length);
    document.getElementById('dailyCompliment').textContent = compliments[random];
}

function generateQuestion() {
    const random = Math.floor(Math.random() * questions.length);
    document.getElementById('dailyQuestion').textContent = questions[random];
}

function generateMemory() {
    const random = Math.floor(Math.random() * memories.length);
    document.getElementById('dailyMemory').textContent = memories[random];
}

function generateQuote() {
    const random = Math.floor(Math.random() * quotes.length);
    document.getElementById('dailyQuote').textContent = quotes[random];
}   