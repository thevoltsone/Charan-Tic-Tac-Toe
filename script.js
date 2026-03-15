document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const statusText = document.getElementById('status');
    const resetBtn = document.getElementById('reset-btn');
    const restartBtn = document.getElementById('restart-btn');
    const winnerOverlay = document.getElementById('winner-overlay');
    const winnerMessage = document.getElementById('winner-message');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    const handleCellClick = (e) => {
        const cell = e.target;
        const index = cell.getAttribute('data-index');

        if (board[index] !== '' || !gameActive) {
            return;
        }

        updateCell(cell, index);
        checkWinner();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCellClick(e);
        }
    };

    const updateCell = (cell, index) => {
        board[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());
        cell.setAttribute('aria-label', `Cell ${index}, contains ${currentPlayer}`);
    };

    const changePlayer = () => {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusText.innerHTML = `Player <span id="current-player" class="player-${currentPlayer.toLowerCase()}">${currentPlayer}</span>'s turn`;
    };

    const checkWinner = () => {
        let roundWon = false;
        let winningCells = [];

        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                roundWon = true;
                winningCells = [a, b, c];
                break;
            }
        }

        if (roundWon) {
            gameActive = false;
            
            // Highlight winning cells with animation delay
            winningCells.forEach((index, idx) => {
                setTimeout(() => {
                    cells[index].classList.add('winner');
                }, idx * 100);
            });

            setTimeout(() => {
                showWinnerOverlay(`Player <span class="player-${currentPlayer.toLowerCase()}">${currentPlayer}</span> Wins!`);
            }, 800);
            return;
        }

        if (!board.includes('')) {
            gameActive = false;
            setTimeout(() => {
                showWinnerOverlay("It's a Draw!");
            }, 500);
            return;
        }

        changePlayer();
    };

    const showWinnerOverlay = (message) => {
        winnerMessage.innerHTML = message;
        winnerOverlay.classList.remove('hide');
        restartBtn.focus();
    };

    const resetGame = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        
        cells.forEach((cell, index) => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'winner');
            cell.setAttribute('aria-label', `Cell ${index}, empty`);
        });

        winnerOverlay.classList.add('hide');
        
        statusText.innerHTML = `Player <span id="current-player" class="player-x">X</span>'s turn`;
    };

    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
        cell.addEventListener('keydown', handleKeyDown);
    });
    
    resetBtn.addEventListener('click', resetGame);
    restartBtn.addEventListener('click', resetGame);
});
