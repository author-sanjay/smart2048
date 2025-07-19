# 🧠 DepthMind 2048

A recursive AI bot that plays the 2048 game using a depth-limited minimax strategy. It simulates future tile placements (2 and 4), avoids dead ends, and picks the optimal move at each step.

![2048 AI Bot](https://upload.wikimedia.org/wikipedia/commons/7/79/2048_game.gif)

---

## 🚀 Features

- 🤖 Fully autonomous AI – no player input required
- 🔁 Depth-limited recursion (default: 3 levels)
- 📉 Move pruning – avoids paths that lead to dead ends
- 🎯 Heuristic-based evaluation of board states
- 🧠 Smart handling of 2 and 4 tile probabilities (90% and 10%)
- 🔄 Auto-simulation of all four directions
- 💡 Easy to modify, plug into any 2048 board

---

## 🧩 How It Works

The AI uses a recursive minimax-like approach:

- **AI Turn**: Simulate all 4 directions (`up`, `down`, `left`, `right`). Only valid moves are evaluated.
- **Tile Spawn Turn**: For each empty cell, simulate placing a 2 (90% chance) and 4 (10%) and continue the recursion.
- If no move is possible before reaching the depth, the path is discarded entirely.

---

## 🧮 Heuristic

The AI evaluates board states using a heuristic function, factoring:
- Number of empty tiles
- Monotonicity (smoothness of tile values)
- Max tile value
- Overall score

> You can customize this easily in `evaluateHeuristic(board)`.

---

## Demo



[Screencast from 2025-07-17 23-09-01.webm](https://github.com/user-attachments/assets/42ec2bd5-f54c-42ea-b26b-71d55a1f2622)
