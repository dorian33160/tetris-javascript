import Piece from "./piece.js";
import TetrisView from './view.js';

class TetrisModel {

    constructor(view) {
    this.grid = view.getEmptyGrid();

    this.currentPiece = this.getRandomPiece(this.grid);
    this.nextPiece = this.getRandomPiece(this.grid);

    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.gameOver = false;
    this.intervalId = undefined;
    this.speed = 1000; // the speed of the falling pieces in ms
  }

  


  // Met à jour l'état du jeu
  update() {
    if (this.gameOver) {
      return;
    }
    //check collision with the bottom of the grid or other piece 
    if (this.currentPiece.checkCollision()) {
      this.currentPiece.placePiece();
      this.currentPiece = this.nextPiece;
      this.nextPiece = this.getRandomPiece();
      if (this.currentPiece.checkCollision()) {
        this.gameOver = true;
        return;
      }
    }
    //Code for counting completed lines and increase the score
    let completedLines = 0;
    for (let i = 0; i < this.grid.length; i++) {
      if (this.grid[i].every((val) => val !== 0)) {
        completedLines++;
        this.grid.splice(i, 1);
        this.grid.unshift(new Array(10).fill(0));
        i--;
      }
    }
    this.score += completedLines * completedLines * 100;
    this.lines += completedLines;
    // Code for increasing the level
    if (this.lines >= this.level * 10) {
      this.level++;
      clearInterval(this.intervalId);
      this.speed *= 0.9;
      this.intervalId = setInterval(() => {
        this.currentPiece.moveDown();
        this.update();
      }, this.speed);
    }
  }

  // Fait tourner la pièce courante
  rotatePiece() {
    this.currentPiece.rotate();
    if (this.currentPiece.checkCollision()) {
      this.currentPiece.rotate(false);
    }
  }

  movePieceLeft() {
    this.currentPiece.moveLeft();
    if (this.currentPiece.checkCollision()) {
      this.currentPiece.moveRight();
    }
  }

  // Déplace la pièce courante vers la droite
  movePieceRight() {
    this.currentPiece.moveRight();
    if (this.currentPiece.checkCollision()) {
      this.currentPiece.moveLeft();
    }
  }

  // Déplace la pièce courante vers le bas
  movePieceDown() {
    this.currentPiece.moveDown();
  }

  // Start the game
  start() {
    this.view = new TetrisView(this.game);
    this.view.getEmptyGrid();
  }

  getRandomPiece(grid){
    const pieces = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    const nouvelle_piece = new Piece(pieces[Math.floor(Math.random() * pieces.length)], grid);
    nouvelle_piece.insertPiece();

  }
}

export default TetrisModel