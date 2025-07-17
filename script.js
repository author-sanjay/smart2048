const size = 4;
let board = Array.from({ length: size }, () => Array(size).fill(0));
const game = document.getElementById("game");
let score = 0;
const scoreDiv = document.getElementById("score");

function drawBoard() {
  game.innerHTML = '';
  updateScore();
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const bg = document.createElement('div');
      bg.className = 'cell-bg';
      bg.style.left = `${j * 105}px`;
      bg.style.top = `${i * 105}px`;
      game.appendChild(bg);
    }
  }
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const value = board[i][j];
      if (value !== 0) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.textContent = value;
        tile.style.transform = `translate(${j * 105}px, ${i * 105}px)`;
        game.appendChild(tile);
      }
    }
  }
}

function addRandomTileToBoard(b) {
  const empty = [];
  for (let i = 0; i < size; i++)
    for (let j = 0; j < size; j++)
      if (b[i][j] === 0) empty.push([i, j]);
  if (empty.length === 0) return;
  const [x, y] = empty[Math.floor(Math.random() * empty.length)];
  b[x][y] = Math.random() < 0.9 ? 2 : 4;
}

function addRandomTile() {
  addRandomTileToBoard(board);
}

function slide(row) {
  let arr = row.filter(val => val);
  let merged = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score += arr[i];
      arr[i + 1] = 0;
      merged.push(arr[i]);
      i++;
    } else {
      merged.push(arr[i]);
    }
  }
  while (merged.length < size) merged.push(0);
  return merged;
}

function updateScore() {
  scoreDiv.textContent = `Score: ${score}`;
}

function rotateMatrix(matrix) {
  const N = matrix.length;
  const result = Array.from({ length: N }, () => Array(N).fill(0));
  for (let i = 0; i < N; i++)
    for (let j = 0; j < N; j++)
      result[i][j] = matrix[j][N - i - 1];
  return result;
}

function move(direction) {
  let rotated = 0;
  if (direction === 'up') rotated = 1;
  if (direction === 'right') rotated = 2;
  if (direction === 'down') rotated = 3;

  for (let i = 0; i < rotated; i++) board = rotateMatrix(board);

  let moved = false;
  for (let i = 0; i < size; i++) {
    const original = board[i].slice();
    const newRow = slide(board[i]);
    board[i] = newRow;
    if (!moved && original.toString() !== newRow.toString()) moved = true;
  }

  for (let i = 0; i < (4 - rotated) % 4; i++) board = rotateMatrix(board);

  if (moved) {
    addRandomTile();
    drawBoard();
    if (checkGameOver()) {
      setTimeout(() => alert("Game Over!"), 100);
    }
  }
}

function checkGameOver() {
  for (let i = 0; i < size; i++)
    for (let j = 0; j < size; j++) {
      if (board[i][j] === 0) return false;
      if (j < size - 1 && board[i][j] === board[i][j + 1]) return false;
      if (i < size - 1 && board[i][j] === board[i + 1][j]) return false;
    }
  return true;
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') move('left');
  if (e.key === 'ArrowRight') move('right');
  if (e.key === 'ArrowUp') move('up');
  if (e.key === 'ArrowDown') move('down');
});

function cloneBoard(board) {
  return board.map(row => [...row]);
}

function simulateMove(board, dir) {
  let rotated = 0;
  if (dir === 'up') rotated = 1;
  if (dir === 'right') rotated = 2;
  if (dir === 'down') rotated = 3;

  let temp = cloneBoard(board);
  for (let i = 0; i < rotated; i++) temp = rotateMatrix(temp);

  let totalScore = 0;
  let moved = false;
  for (let i = 0; i < size; i++) {
    const { row: newRow, score: gained } = mergeRow(temp[i]);
    if (temp[i].toString() !== newRow.toString()) moved = true;
    temp[i] = newRow;
    totalScore += gained;
  }

  for (let i = 0; i < (4 - rotated) % 4; i++) temp = rotateMatrix(temp);
  return moved ? { board: temp, score: totalScore } : null;
}

function mergeRow(row) {
  let arr = row.filter(val => val);
  let result = [];
  let i = 0;
  let scoreGained = 0;
  while (i < arr.length) {
    if (arr[i] === arr[i + 1]) {
      const merged = arr[i] * 2;
      scoreGained += merged;
      result.push(merged);
      i += 2;
    } else {
      result.push(arr[i]);
      i++;
    }
  }
  while (result.length < size) result.push(0);
  return { row: result, score: scoreGained };
}

function getEmptyTiles(b) {
  let empty = [];
  for (let i = 0; i < size; i++)
    for (let j = 0; j < size; j++)
      if (b[i][j] === 0) empty.push([i, j]);
  return empty;
}
function hasAnyValidMoves(board) {
  const directions = ['up', 'down', 'left', 'right'];
  for (const dir of directions) {
    if (simulateMove(board, dir)) return true;
  }
  return false;
}

function evaluateBoard(board, depth, isAITurn) {
  if (depth === 0) return evaluateHeuristic(board);

  if (isAITurn) {
    let maxScore = -Infinity;
    for (let dir of ['up', 'down', 'left', 'right']) {
      const result = simulateMove(board, dir);
      if (!result) continue;
      const score = evaluateBoard(result.board, depth - 1, false);
      maxScore = Math.max(maxScore, score);
    }
    return maxScore;
  } else {
    const empty = getEmptyTiles(board);
    if (empty.length === 0) {
      if (depth > 0 && !hasAnyValidMoves(board)) {
        return -Infinity;
      }
      return evaluateHeuristic(board);
    }

    let totalScore = 0;
    for (let [x, y] of empty) {
      [2, 4].forEach(val => {
        const newBoard = cloneBoard(board);
        newBoard[x][y] = val;
        const prob = val === 2 ? 0.9 : 0.1;
        const score = evaluateBoard(newBoard, depth - 1, true);
        totalScore += prob * score;
      });
    }
    return totalScore / empty.length;
  }
}

function evaluateHeuristic(board) {
  const emptyTiles = getEmptyTiles(board).length;
  const maxTile = Math.max(...board.flat());
  return emptyTiles * 10 + maxTile;
}

function chooseBestMoveRecursive(board, depth = 3) {
  let bestMove = null;
  let bestScore = -Infinity;

  for (let dir of ['up', 'down', 'left', 'right']) {
    const result = simulateMove(board, dir);
    if (!result) continue;
    const score = evaluateBoard(result.board, depth - 1, false);
    if (score > bestScore) {
      bestScore = score;
      bestMove = dir;
    }
  }

  return bestMove;
}

function autoPlay() {
  const interval = setInterval(() => {
    const bestMove = chooseBestMoveRecursive(board, 3);
    if (bestMove) {
      move(bestMove);
    } else {
      clearInterval(interval);
      console.log("Game Over");
    }
  }, 100);
}

function init() {
  board = Array.from({ length: size }, () => Array(size).fill(0));
  score = 0;
  updateScore();
  addRandomTile();
  addRandomTile();
  drawBoard();
  autoPlay();
}

init();