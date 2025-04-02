// Game state
const gameState = {
    currentPlayer: 'X',
    platforms: Array(4).fill().map(() => Array(16).fill(null)),
    gameOver: false
};

// DOM elements
const cells = document.querySelectorAll('.cell');
const turnIndicator = document.getElementById('turn-indicator');
const restartBtn = document.getElementById('restart-btn');
const winModal = document.getElementById('win-modal');
const winMessage = document.getElementById('win-message');
const playAgainBtn = document.getElementById('play-again-btn');
const homeBtn = document.getElementById('home-btn');

// Initialize game
function initGame() {
    gameState.currentPlayer = 'X';
    gameState.platforms = Array(4).fill().map(() => Array(16).fill(null));
    gameState.gameOver = false;
    gameState.markedPlatforms = { X: new Set(), O: new Set() };

    // Clear all cells
    cells.forEach(cell => {
        cell.classList.remove('x', 'o');
        cell.textContent = '';
    });

    // Update UI
    updateTurnIndicator();
    winModal.classList.add('hidden');
}

// Handle cell click
function handleCellClick(event) {
    if (gameState.gameOver) return;

    const cell = event.target;
    const platformIndex = parseInt(cell.closest('.platform').dataset.platform);
    const cellIndex = parseInt(cell.dataset.cell);

    // Check if cell is already occupied
    if (gameState.platforms[platformIndex][cellIndex]) return;

    // Mark the cell
    gameState.platforms[platformIndex][cellIndex] = gameState.currentPlayer;
    cell.classList.add(gameState.currentPlayer.toLowerCase());
    cell.textContent = gameState.currentPlayer;

    // Check for wins
    if (checkWin(platformIndex) || checkCrossPlatformWin()) {
        gameState.gameOver = true;
        showWinMessage();
        return;
    }

    // Switch player
    gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
    updateTurnIndicator();
}

// Check for 4-in-a-row on a platform
function checkWin(platformIndex) {
    const platform = gameState.platforms[platformIndex];
    const player = gameState.currentPlayer;

    // Check rows
    for (let row = 0; row < 4; row++) {
        if (
            platform[row*4] === player &&
            platform[row*4+1] === player &&
            platform[row*4+2] === player &&
            platform[row*4+3] === player
        ) {
            return true;
        }
    }

    // Check columns
    for (let col = 0; col < 4; col++) {
        if (
            platform[col] === player &&
            platform[col+4] === player &&
            platform[col+8] === player &&
            platform[col+12] === player
        ) {
            return true;
        }
    }

    // Check diagonals
    if (
        platform[0] === player &&
        platform[5] === player &&
        platform[10] === player &&
        platform[15] === player
    ) {
        return true;
    }

    if (
        platform[3] === player &&
        platform[6] === player &&
        platform[9] === player &&
        platform[12] === player
    ) {
        return true;
    }

    return false;
}

// Check for cross-platform win (one mark in same position on all platforms)
function checkCrossPlatformWin() {
    const player = gameState.currentPlayer;
    
    // Check all possible positions (0-15)
    for (let pos = 0; pos < 16; pos++) {
        let allPlatformsHaveMark = true;
        
        // Check if all 4 platforms have player's mark at this position
        for (let platform = 0; platform < 4; platform++) {
            if (gameState.platforms[platform][pos] !== player) {
                allPlatformsHaveMark = false;
                break;
            }
        }
        
        if (allPlatformsHaveMark) return true;
    }
    
    return false;
}

// Update turn indicator
function updateTurnIndicator() {
    turnIndicator.innerHTML = `Player <span class="${gameState.currentPlayer === 'X' ? 'text-blue-400' : 'text-red-400'}">${gameState.currentPlayer}</span>'s Turn`;
}

// Show win message
function showWinMessage() {
    winMessage.textContent = `Player ${gameState.currentPlayer} Wins!`;
    winModal.classList.remove('hidden');
}

// Event listeners
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);
homeBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}

// Initialize game on load
document.addEventListener('DOMContentLoaded', initGame);
