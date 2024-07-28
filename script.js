const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
const WINNING_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const messageElement = document.getElementById('message');
const winnerMessageElement = document.getElementById('winnerMessage');
const restartButton = document.getElementById('restartButton');
let circleTurn;

startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
    circleTurn = false;
    cellElements.forEach(cell => {
        cell.classList.remove(X_CLASS);
        cell.classList.remove(CIRCLE_CLASS);
        cell.textContent = '';  // Clear the content of the cell
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick, { once: true });
    });
    setBoardHoverClass();
    messageElement.classList.remove('show');
}

function handleClick(e) {
    const cell = e.target;
    const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
    placeMark(cell, currentClass);
    if (checkWin(currentClass)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
        if (circleTurn) {
            // Computer's move
            setTimeout(computerMove, 500);  // Add a slight delay for better UX
        }
    }
}

function computerMove() {
    const availableCells = [...cellElements].filter(cell => {
        return !cell.classList.contains(X_CLASS) && !cell.classList.contains(CIRCLE_CLASS);
    });

    // 1. Try to win
    for (let cell of availableCells) {
        cell.classList.add(CIRCLE_CLASS);
        if (checkWin(CIRCLE_CLASS)) {
            cell.textContent = 'O';
            finalizeComputerMove(cell);
            return;
        }
        cell.classList.remove(CIRCLE_CLASS);
    }

    // 2. Block the player from winning
    for (let cell of availableCells) {
        cell.classList.add(X_CLASS);
        if (checkWin(X_CLASS)) {
            cell.classList.remove(X_CLASS);
            cell.classList.add(CIRCLE_CLASS);
            cell.textContent = 'O';
            finalizeComputerMove(cell);
            return;
        }
        cell.classList.remove(X_CLASS);
    }

    // 3. Take the center
    const centerCell = cellElements[4];
    if (!centerCell.classList.contains(X_CLASS) && !centerCell.classList.contains(CIRCLE_CLASS)) {
        centerCell.classList.add(CIRCLE_CLASS);
        centerCell.textContent = 'O';
        finalizeComputerMove(centerCell);
        return;
    }

    // 4. Take a random corner
    const corners = [cellElements[0], cellElements[2], cellElements[6], cellElements[8]];
    const availableCorners = corners.filter(cell => !cell.classList.contains(X_CLASS) && !cell.classList.contains(CIRCLE_CLASS));
    if (availableCorners.length > 0) {
        const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)];
        randomCorner.classList.add(CIRCLE_CLASS);
        randomCorner.textContent = 'O';
        finalizeComputerMove(randomCorner);
        return;
    }

    // 5. Take a random side
    const sides = [cellElements[1], cellElements[3], cellElements[5], cellElements[7]];
    const availableSides = sides.filter(cell => !cell.classList.contains(X_CLASS) && !cell.classList.contains(CIRCLE_CLASS));
    if (availableSides.length > 0) {
        const randomSide = availableSides[Math.floor(Math.random() * availableSides.length)];
        randomSide.classList.add(CIRCLE_CLASS);
        randomSide.textContent = 'O';
        finalizeComputerMove(randomSide);
        return;
    }

    // Default: Take a random available cell
    const randomIndex = Math.floor(Math.random() * availableCells.length);
    const cell = availableCells[randomIndex];
    cell.classList.add(CIRCLE_CLASS);
    cell.textContent = 'O';
    finalizeComputerMove(cell);
}

function finalizeComputerMove(cell) {
    if (checkWin(CIRCLE_CLASS)) {
        endGame(false);
    } else if (isDraw()) {
        endGame(true);
    } else {
        swapTurns();
        setBoardHoverClass();
    }
}

function endGame(draw) {
    if (draw) {
        winnerMessageElement.innerText = 'Draw!';
    } else {
        winnerMessageElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`;
    }
    messageElement.classList.add('show');
}

function isDraw() {
    return [...cellElements].every(cell => {
        return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS);
    });
}

function placeMark(cell, currentClass) {
    cell.classList.add(currentClass);
    cell.textContent = currentClass === X_CLASS ? 'X' : 'O';  // Add text content
}

function swapTurns() {
    circleTurn = !circleTurn;
}

function setBoardHoverClass() {
    board.classList.remove(X_CLASS);
    board.classList.remove(CIRCLE_CLASS);
    if (circleTurn) {
        board.classList.add(CIRCLE_CLASS);
    } else {
        board.classList.add(X_CLASS);
    }
}

function checkWin(currentClass) {
    return WINNING_COMBINATIONS.some(combination => {
        return combination.every(index => {
            return cellElements[index].classList.contains(currentClass);
        });
    });
}
