import TetrisModel from "./modele.js";

export let ctx;
export let grid = [];

class TetrisView {

    constructor(game) {
    this.game = game 

    this.startButton = document.getElementById("start");
    this.pauseButton = document.getElementById("stop");
    this.canvas = document.getElementById('tetris-canvas');
    ctx = this.canvas.getContext('2d');

    this.startButton.addEventListener('click', () => {
      this.start();
    });
    this.pauseButton.addEventListener('click', () => {
      this.pause();
    });
    document.addEventListener('keydown', (event) => {
      switch (event.keyCode) {
        case 37:
          this.game.movePieceLeft();
          break;
        case 39:
          this.game.movePieceRight();
          break;
        case 40:
          this.game.movePieceDown();
          break;
        case 38:
          this.game.rotatePiece();
          break;
      }
    });
    this.game = new TetrisModel(this);
  }

    // Génère une grille vide
getEmptyGrid() {

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 0.5;
    ctx.background = 'white';

    ctx.fillStyle = ctx.background;
    ctx.fillRect(0, 0, 350, 640);

    for (let i = 0; i < 20; i++) {
      grid[i] = new Array(10).fill(0);
    }

    for (let x = 0; x < 11; x++) {
        ctx.beginPath();
        ctx.moveTo(x * 20, 0);
        ctx.lineTo(x * 20, 20 * 20);
        ctx.stroke();
    }

    // Dessine les lignes horizontales de la grille
    for (let y = 0; y < 21; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * 20);
        ctx.lineTo(10 * 20, y * 20);
        ctx.stroke();
    }
    //this.cols = grid[0].length;
    //this.rows = grid.length;
    //console.log(this.cols);
    //console.log(this.rows);
    //console.log(grid);
    return grid;
  }

  start() {
    let piece = this.game.getRandomPiece(grid);
  }
  
  //Pause the game
  pause() {
    clearInterval(this.intervalId);
    this.intervalId = undefined;
  }

}

export default TetrisView