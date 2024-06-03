import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  squares: any[];
  started: boolean;
  playerCount: number;
  xIsNext: boolean;
  winner: string | null;
  knnOutput: string | null;
  mlpOutput: string | null;
  decisionTreeOutput: string | null;
  apiError: string | null;

  constructor() {
    this.squares = Array(9).fill(0);
    this.started = false;
    this.playerCount = 1;
    this.winner = null;
    this.xIsNext = true;
    this.knnOutput = null;
    this.mlpOutput = null;
    this.decisionTreeOutput = null;
    this.apiError = null;
  }

  ngOnInit() {
    this.newGame();
  }

  newGame() {
    this.squares = Array(9).fill(0);
    this.started = false;
    this.playerCount = 1;
    this.winner = null;
    this.xIsNext = true;
    this.knnOutput = null;
    this.mlpOutput = null;
    this.decisionTreeOutput = null;
    this.apiError = null;
  }

  get player() {
    return this.xIsNext ? 'X' : 'O';
  }

  changePlayerCount() {
    if (this.playerCount === 1) {
      this.playerCount = 2;
    } else {
      this.playerCount = 1;
    }
  }

  makeMove(idx: number) {
    if (!this.started) {
      this.started = true;
    }
    if (!this.squares[idx]) {
      this.squares.splice(idx, 1, this.player);
      this.xIsNext = !this.xIsNext;
    }
    // Make random computer move
    if (this.playerCount === 1 && !this.winner) {
      const emptySquares = this.squares
        .map((square, idx) => (square ? null : idx))
        .filter((idx) => idx !== null) as number[];
      const randomIdx = Math.floor(Math.random() * emptySquares.length);
      this.squares.splice(emptySquares[randomIdx], 1, this.player);
      this.xIsNext = !this.xIsNext;
    }
    this.winner = this.calculateWinner();
    this.aiPredict();
  }

  calculateWinner() {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        this.squares[a] &&
        this.squares[a] === this.squares[b] &&
        this.squares[a] === this.squares[c]
      ) {
        return this.squares[a];
      }
    }
    return null;
  }

  aiPredict() {
    const board = this.squares.join(',');
    this.apiError = null;
    fetch(`http://localhost:8080/${board}`)
      .then((response) => response.json())
      .then((data) => {
        const { kNN,  MLP, DTree } = data;
        this.knnOutput = kNN;
        this.mlpOutput = MLP;
        this.decisionTreeOutput = DTree;
      })
      .catch((error) => {
        if (error instanceof Error) {
          if (error.message === 'Failed to fetch') {
            error = 'Failed to connect to the API';
          } else {
            error = 'An unexpected error occurred';
            console.error(error);
          }
        }
        this.apiError = error;
      });
  }
}
