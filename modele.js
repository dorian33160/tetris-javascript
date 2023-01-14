import Piece from "./piece.js";
import TetrisView from './view.js';

class TetrisModel {

    constructor(view) {
    
    this.grid = view.getEmptyGrid();
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.gameOver = false;
  }

  // Binding.
  bindDisplayGrid (callback) {
    // Définition d'une nouvelle propriété pouvant être utilisée à partir d'une instance de Model.
    this.DisplayGrid = callback; // On veut pouvoir actualiser la View (depuis le Controller) quand nous récupérons les données.
  }
  

  start() {
    this.view = new TetrisView(this.game);
    this.view.getEmptyGrid();
  }

  getRandomPiece(grid){
    const pieces = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    const new_piece = new Piece(pieces[Math.floor(Math.random() * pieces.length)], grid);
    new_piece.insertPiece();
    refreshGrid();
  }

}

export default TetrisModel