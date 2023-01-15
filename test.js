class Controller {
    constructor(modele, view) {
        this.modele = modele;
        this.view = view;
        /*** Bindings ***
          La fonction bind() permet de sceller le contexte dans lequel la fonction sera appelée.
          Dans cet exemple, on veut toujours que les fonctions bindDisplayCNF() et bindGetCNF() (de cette classe) soient appelées dans le contexte du Controller.
          Ce contexte est primordial car il permet d'accéder aux attributs de notre classe.
          ---
          Sans la fonction bind(), les différentes fonctions passées en callback seraient appelées dans le contexte de la classe qu'il l'exécute.
          Par conséquent, nous ne pourrions pas accéder à la View depuis le Model ou au Model depuis la View.
        */
        this.bindgetEmptyGrid = this.bindgetEmptyGrid.bind(this);
        this.modele.bindgetEmptyGrid(this.bindgetEmptyGrid);

        this.bindgetRandomPiece = this.bindgetRandomPiece.bind(this);
        this.view.bindgetRandomPiece(this.bindgetRandomPiece);

        this.binddrop = this.binddrop.bind(this);
        this.view.binddrop(this.binddrop);

    }

    bindgetEmptyGrid(grid) {
        this.view.getEmptyGrid(grid);
    }

    bindgetRandomPiece(grid) {
        this.modele.getRandomPiece(grid);
    }

    binddrop() {
        this.modele.drop();
    }
}

export let ctx;
export let grid = [];

class TetrisView {

    constructor() {

        this.startButton = document.getElementById("start");
        this.pauseButton = document.getElementById("stop");

        this.canvas = document.getElementById('tetris-canvas');
        ctx = this.canvas.getContext('2d');
        this.getEmptyGrid();

        this.startButton.addEventListener('click', () => {
            this.start();
        });
        this.pauseButton.addEventListener('click', () => {
            this.pause();
        });

        this.game = new TetrisModel(this);
    }

    bindgetRandomPiece (callback) {
        // Définition d'une nouvelle propriété pouvant être utilisée à partir d'une instance de Model.
        this.getRandomPiece = callback; // On veut pouvoir actualiser la View (depuis le Controller) quand nous récupérons les données.
      }

    binddrop (callback) {
    // Définition d'une nouvelle propriété pouvant être utilisée à partir d'une instance de Model.
    this.drop = callback; // On veut pouvoir actualiser la View (depuis le Controller) quand nous récupérons les données.
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

        let columnWidth = 350/10;
        let rowHeight = 640/20; 

        for (let x = 0; x < 11; x++) {
            ctx.beginPath();
            ctx.moveTo(x * columnWidth, 0);
            ctx.lineTo(x * columnWidth, 20 * rowHeight);
            ctx.stroke();
        }

        // Dessine les lignes horizontales de la grille
        for (let y = 0; y < 21; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * rowHeight);
            ctx.lineTo(10 * columnWidth, y * rowHeight);
            ctx.stroke();
        }
        //this.cols = grid[0].length;
        //this.rows = grid.length;
        //console.log(this.cols);
        //console.log(this.rows);
        //console.log(grid);
        return grid;
    }

    //Ecrit une fonction qui arrete la pièce si elle atteint une autre pièce
    //Ecrit une fonction qui supprime une ligne si elle est remplie
    //Ecrit une fonction qui fait descendre les pièces au dessus de la ligne supprimée
    


    start() {
        this.getRandomPiece(grid);
        console.log(grid);
        this.drop();
    }

    //Pause the game
    pause() {
        clearInterval(this.intervalId);
        this.intervalId = undefined;
    }

}

class TetrisModel {

    constructor() {

        this.grid;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameOver = false;
    }

    // Binding.
    bindgetEmptyGrid (callback) {
        // Définition d'une nouvelle propriété pouvant être utilisée à partir d'une instance de Model.
        this.getEmptyGrid = callback; // On veut pouvoir actualiser la View (depuis le Controller) quand nous récupérons les données.
      }

    start() {
        this.getEmptyGrid();
    }

    getRandomPiece(grid) {
        const pieces = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
        const new_piece = new Piece(pieces[Math.floor(Math.random() * pieces.length)], grid);
        new_piece.insertPiece();
        this.updateGrid();
    }

    updateGrid() {
        // On efface la grille
        ctx.fillStyle = ctx.background;
        ctx.fillRect(0, 0, 350, 640);
        // On dessine les lignes

        let columnWidth = 350/10;
        let rowHeight = 640/20;

        for (let x = 0; x < 11; x++) {
            ctx.beginPath();
            ctx.moveTo(x * columnWidth, 0);
            ctx.lineTo(x * columnWidth, 20 * rowHeight);
            ctx.stroke();
        }

        // Dessine les lignes horizontales de la grille
        for (let y = 0; y < 21; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * rowHeight);
            ctx.lineTo(10 * columnWidth, y * rowHeight);
            ctx.stroke();
        }
        
        // On dessine les blocs
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 10; j++) {
                if (grid[i][j] !== 0) {
                    ctx.fillStyle = grid[i][j];
                    ctx.fillRect(j * 35, i * 32, 35, 32);
                }
            }
        }
    }

    moveDown() {
        for (let i = 19; i >= 0; i--) {
            for (let j = 0; j < 10; j++) {
                if (grid[i][j] !== 0) {
                    if (i === 19) {
                        grid[i][j] = grid[i][j];
                    } else {
                        grid[i + 1][j] = grid[i][j];
                        grid[i][j] = 0;
                    }
                }
            }
        }
        this.updateGrid();
    }

    drop() {
        this.intervalId = setInterval(() => {
            this.moveDown();
        }, 1000);
    }

}

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
                    this.blocks.push({ col: this.position.x + j, row: this.position.y + i });
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

const app = new Controller(new TetrisModel(), new TetrisView());