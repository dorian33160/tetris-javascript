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

        this.bindupdateGrid = this.bindupdateGrid.bind(this);
        this.modele.bindupdateGrid(this.bindupdateGrid);

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

    bindupdateGrid() {
        this.view.updateGrid();
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

        //Deplacement lorsque on appuit sur fleche gauche (37), fleche du haut (38), fleche de droite (39)
        /*document.addEventListener("keydown", function(event) {
            if (event.keyCode == 37) {
                // Move piece left
            } else if (event.keyCode == 39) {
                // Move piece right
            } else if (event.keyCode == 38) {
                // Rotate piece
            }
        });
        */
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

    bindifCollisionStop (callback) {
        // Définition d'une nouvelle propriété pouvant être utilisée à partir d'une instance de Model.
        this.ifCollisonStop = callback; // On veut pouvoir actualiser la View (depuis le Controller) quand nous récupérons les données.
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
                    switch (grid[i][j]) {
                        case 1:
                                ctx.fillStyle = 'blue';
                        break;

                        case 2:
                                ctx.fillStyle = 'green';
                        break;

                        case 3:
                                ctx.fillStyle = 'red';
                        break;

                        case 4:
                                ctx.fillStyle = 'purple';
                        break;

                        case 5:
                                ctx.fillStyle = 'grey';
                        break;
                        
                        case 6:
                                ctx.fillStyle = 'yellow';
                        break;
                        
                        case 7:
                                ctx.fillStyle = 'pink';
                          break;
                      }
                    ctx.fillRect(j * 35, i * 32, 35, 32);
                }
            }
        }
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

        // Dessine les lignes verticales de la grille
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

        return grid;
    }

    start() {
        this.getRandomPiece(grid);
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
        this.currentPiece;
        this.nextPiece;
    }
    
    // Binding.
    bindgetEmptyGrid (callback) {
        // Définition d'une nouvelle propriété pouvant être utilisée à partir d'une instance de Model.
        this.getEmptyGrid = callback; // On veut pouvoir actualiser la View (depuis le Controller) quand nous récupérons les données.
    }

    bindupdateGrid (callback) {
        // Définition d'une nouvelle propriété pouvant être utilisée à partir d'une instance de Model.
        this.updateGrid = callback; // On veut pouvoir actualiser la View (depuis le Controller) quand nous récupérons les données.
    }

    //Focntion qui se lance au démarrage du jeu
    start() {
        this.getEmptyGrid();
    }

    //ecrit la fonction getrandompiece pour qu'elle ajoute une couleuer à la piece
    getRandomPiece(grid) {
        const pieces = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
        this.currentPiece = new Piece(pieces[Math.floor(Math.random() * pieces.length)], grid);
        this.nextPiece = new Piece(pieces[Math.floor(Math.random() * pieces.length)], grid);
        this.currentPiece.insertPiece();
        this.updateGrid();
        this.drop();
    }

    moveDown() {
        for (let i = 19; i >= 0; i--) {
            for (let j = 0; j < 10; j++) {
                if (grid[i][j] !== 0) {
                    if (i !== 19 && grid[i + 1][j] === 0) {
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
            console.log(this.currentPiece);
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
                    this.blocks.push({ col: this.position.x + j, row: this.position.y + i, color: this.shape[i][j] });
                }
            }
        }
    }

    // Retourne la forme de la pièce en fonction de son type et de sa rotation
    getShape() {
        const shapes = {
            I: [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]],
            J: [[2, 0, 0], [2, 2, 2], [0, 0, 0]],
            L: [[0, 0, 3], [3, 3, 3], [0, 0, 0]],
            O: [[4, 4], [4, 4]],
            S: [[0, 5, 5], [5, 5, 0], [0, 0, 0]],
            T: [[0, 6, 0], [6, 6, 6], [0, 0, 0]],
            Z: [[7, 7, 0], [0, 7, 7], [0, 0, 0]],
        };
        return shapes[this.type];
    }

    insertPiece() {
        this.blocks.forEach(block => {
            grid[block.row][block.col] = block.color;
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

    //ecrit une fonction qui arrête la pièce quand elle atteint la dernière ligne de la grille
    stopPiece() {
        for (let i = 0; i < this.blocks.length; i++) {
            if (this.blocks[i].row === 19) {
                this.blocks[i].row = this.blocks[i].row;
            } else {
                this.blocks[i].row += 1;
            }
        }
    }
}

const app = new Controller(new TetrisModel(), new TetrisView());