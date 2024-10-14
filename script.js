const anpanmanData = [
    { front: "images/航海王1.png", back: "images/航海王2.png" },
    { front: "images/航海王1.png", back: "images/航海王3.png" },
    { front: "images/航海王1.png", back: "images/航海王4.png" },
    { front: "images/航海王1.png", back: "images/航海王5.png" },
    { front: "images/航海王1.png", back: "images/航海王6.png" },
    { front: "images/航海王1.png", back: "images/航海王7.png" },
    { front: "images/航海王1.png", back: "images/航海王8.png" },
    { front: "images/航海王1.png", back: "images/航海王9.png" },
    { front: "images/航海王1.png", back: "images/航海王10.png" },
    { front: "images/航海王1.png", back: "images/航海王11.png" },
    { front: "images/航海王1.png", back: "images/航海王12.png" },
    { front: "images/航海王1.png", back: "images/航海王13.png" },
    { front: "images/航海王1.png", back: "images/航海王14.png" },
    { front: "images/航海王1.png", back: "images/航海王15.png" },
    { front: "images/航海王1.png", back: "images/航海王16.png" },
    { front: "images/航海王1.png", back: "images/航海王17.png" },
    { front: "images/航海王1.png", back: "images/航海王18.png" },
    { front: "images/航海王1.png", back: "images/航海王19.png" }
];

const atashinchiData = [
    { front: "image/我們這一家1.jpg", back: "image/我們這一家2.jpg" },
    { front: "image/我們這一家1.jpg", back: "image/我們這一家3.jpg" },
    { front: "image/我們這一家1.jpg", back: "image/我們這一家19.jpg" },
    { front: "image/我們這一家1.jpg", back: "image/我們這一家4.jpg" },
    { front: "image/我們這一家1.jpg", back: "image/我們這一家5.jpg" },
    { front: "image/我們這一家1.jpg", back: "image/我們這一家6.jpg" },
    { front: "image/我們這一家1.jpg", back: "image/我們這一家7.jpg" },
    { front: "image/我們這一家1.jpg", back: "image/我們這一家8.jpg" },
    { front: "image/我們這一家1.jpg", back: "image/我們這一家9.jpg" },
    { front: "image/我們這一家1.jpg", back: "image/我們這一家10.jpg" },
    { front: "image/我們這一家1.jpg", back: "image/我們這一家11.jpg" },
    { front: "image/我們這一家1.jpg", back: "image/我們這一家12.jpg" },
    { front: "image/我們這一家1.jpg", back: "image/我們這一家13.jpg" },
    { front: "image/我們這一家1.jpg", back: "image/我們這一家14.jpg" },
    { front: "image/我們這一家1.jpg", back: "image/我們這一家15.jpg" },
    { front: "image/我們這一家1.jpg", back: "image/我們這一家16.jpg" },
    { front: "image/我們這一家1.jpg", back: "image/我們這一家17.jpg" },
    { front: "image/我們這一家1.jpg", back: "image/我們這一家18.jpg" }
];

let isRiceGame = true; // 初始遊戲為航海王
const imageContainer = document.getElementById('imageContainer');
const timerDisplay = document.getElementById('timer');
const gameTimeDisplay = document.getElementById('gameTime');
const gridSizeSelect = document.getElementById('gridSize');
const countdownTimeSelect = document.getElementById('countdownTime');
const restartButton = document.createElement('button');
restartButton.textContent = '重新開始';
restartButton.style.display = 'none'; 
document.body.appendChild(restartButton); 

let deck = [];
let flippedCards = [];
let lockBoard = false;
let gameTime = 0;
let gameTimerInterval;
let matchedCards = 0;

const successSound = document.getElementById('successSound');
const failureSound = document.getElementById('failureSound');

// 隨機打亂數組
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 創建卡片
function createDeck(isRice) {
    const gridSize = parseInt(gridSizeSelect.value);
    const totalCards = gridSize * gridSize;
    const totalPairs = totalCards / 2;

    deck = [];
    const data = isRice ? anpanmanData : atashinchiData;

    for (let i = 0; i < totalPairs; i++) {
        const cardData = data[i % data.length]; // 確保使用正確的資料
        deck.push({ front: cardData.front, back: cardData.back });
        deck.push({ front: cardData.front, back: cardData.back }); // 添加匹配對
    }

    // 隨機打亂卡片順序
    shuffle(deck);

    imageContainer.innerHTML = '';  // 清空畫面

    deck.forEach((card, index) => {
        const flipContainer = document.createElement('div');
        flipContainer.classList.add('flip-container', 'flipped'); // 立即添加 'flipped' 類
        flipContainer.setAttribute('data-card', index);

        const flipper = document.createElement('div');
        flipper.classList.add('flipper');

        const front = document.createElement('div');
        front.classList.add('front');
        const frontImg = document.createElement('img');
        frontImg.src = card.front;
        frontImg.alt = `Image Front`;
        front.appendChild(frontImg);

        const back = document.createElement('div');
        back.classList.add('back');
        const backImg = document.createElement('img');
        backImg.src = card.back;
        backImg.alt = `Image Back`;
        back.appendChild(backImg);

        flipper.appendChild(front);
        flipper.appendChild(back);
        flipContainer.appendChild(flipper);
        imageContainer.appendChild(flipContainer);

        // 監聽卡片翻轉
flipContainer.addEventListener('click', function () {
    if (lockBoard || this.classList.contains('matched') || flippedCards.includes(this)) return;

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        lockBoard = true;

        const card1 = flippedCards[0].querySelector('.back img').src;
        const card2 = flippedCards[1].querySelector('.back img').src;

        if (card1 === card2 && flippedCards[0] !== flippedCards[1]) {
            successSound.play();
            flippedCards.forEach(card => {
                card.classList.add('matched'); // 將匹配的卡片標記為已匹配
                card.style.visibility = 'hidden'; // 將匹配的卡片隱藏，但保留空間
            });

            setTimeout(() => {
                matchedCards++; 
                resetBoard();
                checkGameOver();
            }, 1000);
        } else {
            failureSound.play();
            setTimeout(() => {
                flippedCards.forEach(card => card.classList.remove('flipped'));
                resetBoard();
            }, 1000);
        }
    }
});
    });

    updateGridLayout(gridSize);
}

// 開始遊戲
document.getElementById('startGame').addEventListener('click', () => {
    // 先翻轉所有卡片到背面
    document.querySelectorAll('.flip-container').forEach(container => {
        container.classList.add('flipped'); // 確保所有卡片都翻到背面
    });

    let countdown = parseInt(countdownTimeSelect.value);
    timerDisplay.textContent = `倒計時: ${countdown}`;

    const countdownInterval = setInterval(() => {
        countdown--;
        timerDisplay.textContent = `倒計時: ${countdown}`;
        if (countdown === 0) {
            clearInterval(countdownInterval);
            // 倒計時結束後，翻轉所有卡片到正面
            document.querySelectorAll('.flip-container').forEach(container => {
                container.classList.remove('flipped'); // 翻到正面
            });

            startGameTimer();
        }
    }, 1000);

    matchedCards = 0; 
    createDeck(isRiceGame);
    restartButton.style.display = 'none'; 
});

// 開始遊戲計時器
function startGameTimer() {
    const gameTimeLimit = parseInt(countdownTimeSelect.value) * 1000 + (parseInt(gameTimeDisplay.value) * 60000); // 添加倒計時時間
    gameTime = 0; 
    gameTimerInterval = setInterval(() => {
        gameTime += 1000; // 每秒增加
        gameTimeDisplay.textContent = `遊戲時間: ${Math.floor(gameTime / 60000)} 分 ${Math.floor((gameTime % 60000) / 1000)} 秒`;
        
        if (gameTime >= gameTimeLimit) {
            clearInterval(gameTimerInterval);
            alert("時間到，遊戲結束！");
            restartButton.style.display = 'block'; // 顯示重新開始按鈕
        }
    }, 1000);
}

// 重置遊戲
function resetBoard() {
    flippedCards = [];
    lockBoard = false;
}

// 檢查遊戲是否結束
function checkGameOver() {
    if (matchedCards === deck.length / 2) {
        clearInterval(gameTimerInterval); // 停止計時器
        
        // 計算遊戲時間
        const minutes = Math.floor(gameTime / 60000);
        const seconds = Math.floor((gameTime % 60000) / 1000);
        
        alert(`遊戲結束!\n遊戲時間: ${minutes} 分 ${seconds} 秒`);
        
        gameTime = 0; // 重設遊戲時間
        gameTimeDisplay.textContent = '遊戲時間: 0'; // 更新顯示
    }
}

// 切換遊戲
document.getElementById('toggleGame').addEventListener('click', () => {
    resetGame(); // Reset game state before toggling
    isRiceGame = !isRiceGame; // Switch game state
    createDeck(isRiceGame); // Create deck with the new game data
    
    const buttonText = isRiceGame ? '切換到我們這一家卡片' : '切換到航海王卡片';
    document.getElementById('toggleGame').innerText = buttonText; // Update button text
    restartButton.style.display = 'none'; // Hide restart button
});

// 重置遊戲
function resetGame() {
    clearInterval(gameTimerInterval); // Stop the timer
    gameTime = 0; // Reset game time
    timerDisplay.textContent = `倒計時: 0`; // Reset countdown display
    gameTimeDisplay.textContent = `遊戲時間: 0 分 0 秒`; // Reset game time display
    matchedCards = 0; // Reset matched cards count
    flippedCards = []; // Clear flipped cards
    lockBoard = false; // Unlock the board for new game
    imageContainer.innerHTML = ''; // Clear the card container
}

// 更新網格佈局
function updateGridLayout(gridSize) {
    imageContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
}

// 初始設定
resetGame();