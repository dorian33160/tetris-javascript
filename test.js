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

        this.bindifCollisionStop = this.bindifCollisionStop.bind(this);
        this.view.bindifCollisionStop(this.bindifCollisionStop);

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

    bindifCollisionStop(grid) {
        this.modele.ifCollisonStop(grid);
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
<<<<<<< Updated upstream
                    ctx.fillStyle = 'blue';
=======
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
>>>>>>> Stashed changes
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
        console.log(grid);
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

    //Fonction qui arrete la piece si checkCollision renvoie true
    ifCollisonStop() {
        if (this.checkCollision(this.currentPiece)) {
            this.currentPiece.y--;
            this.currentPiece.insertPiece();
            this.currentPiece = this.nextPiece;
            this.nextPiece = new Piece(pieces[Math.floor(Math.random() * pieces.length)], grid);
            this.updateGrid();
            this.checkLines();
            if (this.checkCollision(this.currentPiece)) {
                this.gameOver = true;
                this.pause();
            }
        } else {
            this.currentPiece.y++;
        }
        this.updateGrid();
    }

    //Fonction qui vérifie si une ligne est remplie
    checkLines() {
        for (let i = 0; i < 20; i++) {
            let line = true;
            for (let j = 0; j < 10; j++) {
                if (grid[i][j] === 0) {
                    line = false;
                }
            }
            if (line) {
                this.lines++;
                this.score += 100;
                this.level = Math.floor(this.lines / 10) + 1;
                for (let k = i; k > 0; k--) {
                    for (let j = 0; j < 10; j++) {
                        grid[k][j] = grid[k - 1][j];
                    }
                }
                for (let j = 0; j < 10; j++) {
                    grid[0][j] = 0;
                }
            }
        }
    }

    //Ecrit la fonction gameover
    gameOver() {
        if (this.gameOver) {
            alert('Game Over');
        }
    }

    //Fonction qui regarde si la pièce ne sort pas de la grille et si elle ne touche pas une autre pièce
    checkCollision(piece) {
        for (let i = 0; i < piece.length; i++) {
            for (let j = 0; j < piece[i].length; j++) {
                if (piece[i][j] !== 0) {
                    if (i + piece.y >= 20 || j + piece.x < 0 || j + piece.x >= 10 || grid[i + piece.y][j + piece.x] !== 0) {
                        return true;
                    }
                }
            }
        }
        return false;
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

//EN ATTENDANT DE TEST LA NVELLE FONCTION
/*
    getRandomPiece(grid) {
        const pieces = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
        const new_piece = new Piece(pieces[Math.floor(Math.random() * pieces.length)], grid);
        new_piece.insertPiece();
        this.updateGrid();
    }
*/
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
            this.checkCollision(this.currentPiece);
            console.log(grid);
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