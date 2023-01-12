export let grid;

class Piece {
    constructor(type, grid_piece) {
    this.type = type;
    grid = grid_piece;
    this.position = { x: 3, y: 0 };
    this.rotation = 0;
    this.shape = this.getShape();
    this.cols = this.shape[0].length;
    this.rows = this.shape.length;
    this.blocks = [];
    for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
            // Si la case est pleine
            if (this.shape[i][j] !== 0) {
                // On ajoute a un tableau block
                this.blocks.push({col: this.position.x + j, row: this.position.y + i});
            }
        }
    }
}

  // Retourne la forme de la pièce en fonction de son type et de sa rotation
  getShape() {
    const shapes = {
      I: [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]],
      J: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
      L: [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
      O: [[1, 1], [1, 1]],
      S: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
      T: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
      Z: [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
    };
    return shapes[this.type];
  }

  insertPiece() {
    this.blocks.forEach(block => {
    grid[block.row][block.col] = 1;
    })
    console.log(grid);
  }
  // Fait tourner la pièce
  rotate(clockwise = true) {
    if (clockwise) {
      this.rotation = (this.rotation + 1) % 4;
    } else {
      this.rotation = (this.rotation + 3) % 4;
    }
    this.shape = this.getShape();
  }

  // Déplace la pièce vers la gauche
  moveLeft() {
    this.position.x--;
  }

  // Déplace la pièce vers la droite
  moveRight() {
    this.position.x++;
  }

  // Déplace la pièce vers le bas
  moveDown() {
    this.position.y++;
  }

  // Vérifie si la pièce va entrer en collision avec les bords de la grille ou une autre pièce
  checkCollision() {
    for (let y = 0; y < this.shape.length; y++) {
      for (let x = 0; x < this.shape[y].length; x++) {
        if (this.shape[y][x] === 0) {
          continue;
        }
        if (
          this.position.x + x < 0 ||
          this.position.x + x > 9 ||
          this.position.y + y > 19 ||
          this.grid[this.position.y + y][this.position.x + x] !== 0
        ) {
          return true;
        }
      }
    }
    return false;
  }

  placePiece() {
    for (let y = 0; y < this.shape.length; y++) {
      for (let x = 0; x < this.shape[y].length; x++) {
        if (this.shape[y][x] === 0) {
          continue;
        }
        this.grid[this.position.y + y][this.position.x + x] = this.type;
      }
    }
  }
}

export default Piece