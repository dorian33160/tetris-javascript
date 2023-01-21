/***************** CLASSE CONTROLLER  ************************/
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

        this.bindmoveRight = this.bindmoveRight.bind(this);
        this.view.bindmoveRight(this.bindmoveRight);

        this.bindmoveLeft = this.bindmoveLeft.bind(this);
        this.view.bindmoveLeft(this.bindmoveLeft);

        this.bindrotate = this.bindrotate.bind(this);
        this.view.bindrotate(this.bindrotate);

        this.bindmoveDown = this.bindmoveDown.bind(this);
        this.view.bindmoveDown(this.bindmoveDown);

        this.bindremoveLine = this.bindremoveLine.bind(this);
        this.modele.bindremoveLine(this.bindremoveLine);

        this.bindgameOver = this.bindgameOver.bind(this);
        this.modele.bindgameOver(this.bindgameOver);

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

    bindmoveRight() {
        this.modele.moveRight();
    }

    bindmoveLeft() {
        this.modele.moveLeft();
    }

    bindrotate() {
        this.modele.rotate();
    }

    bindmoveDown() {
        this.modele.moveDown();
    }

    bindremoveLine() {
        this.view.removeLine();
    }

    bindgameOver() {
        this.view.gameOver();
    }

}
/***************** FIN CLASSE CONTROLLER  ************************/
export let ctx;
export let grid = [];

/***************** CLASSE VIEW  ************************/
class TetrisView {

    constructor() {
        this.score = 0; 
        this.startButton = document.getElementById("start");
        this.pauseButton = document.getElementById("pause");
        this.canvas = document.getElementById('tetris-canvas');
        ctx = this.canvas.getContext('2d');
        this.getEmptyGrid();

        this.startButton.addEventListener('click', () => {
            this.start();
        });
        this.pauseButton.addEventListener('click', () => {
            this.pause();
        });
        

        //Detecte lorsque on appuit sur une touche du clavier
        document.addEventListener("keydown", function(event) {
            if (event.keyCode == 37) { //fleche gauche
                this.moveLeft();
            } else if (event.keyCode == 39) { //fleche de droite
                this.moveRight();
            } else if (event.keyCode == 38) { //fleche du haut pour rotate la piece
                this.rotate();
            } else if (event.keyCode == 40) { //fleche du bas pour faire acceler la piece
                this.moveDown();
            }
        }.bind(this));

        this.game = new TetrisModel(this);
    }  

///////////////////// BIND VIEW  ////////////////////////////////
    bindgetRandomPiece (callback) {
        // Definition d'une nouvelle propriete pouvant etre utilisee a partir d'une instance de Model.
        this.getRandomPiece = callback; // On veut pouvoir actualiser la View (depuis le Controller) quand nous récupérons les données.
    }

    binddrop (callback) {
        this.drop = callback; 
    }

    bindmoveRight (callback) {
        this.moveRight = callback; 
    }

    bindmoveLeft (callback) {
        this.moveLeft = callback; 
    }

    bindrotate (callback) {
        this.rotate = callback; 
    }

    bindmoveDown (callback) {
        this.moveDown = callback; 
    }

///////////////////// FIN BIND VIEW  ////////////////////////////////

    increaseScore() {
        this.score = this.score + 100;
        document.getElementById("score").innerHTML = this.score;
    }

    //Fonction qui permet de supprimer la ligne lorsque elle est pleine et rajoute une ligne de zero en haut de la grille
    removeLine() {
        for (let row = 0; row < grid.length; row++) {
            let isRowFull = grid[row].every(function(cell) {
                return cell !== 0;
            });
            if (isRowFull) {
                grid.splice(row, 1);
                grid.unshift(Array(10).fill(0));
                this.increaseScore();
            }
        }
    }

    //Permet de mettre a jour la grille
    updateGrid() {
        // On efface la grille
        ctx.fillStyle = ctx.background;
        ctx.fillRect(0, 0, 350, 640);
        // On dessine les lignes

        let columnWidth = 350/10;
        let rowHeight = 640/20;

        // Dessine les lignes verticales de la grille
        for (let x = 0; x < 11; x++) {
            ctx.beginPath();
            ctx.moveTo(x * columnWidth, 0); //deplace le curseur de dessin de haut
            ctx.lineTo(x * columnWidth, 20 * rowHeight); // en bas
            ctx.stroke(); //dessine reellement les colonnes
        }

        // Dessine les lignes horizontales de la grille
        for (let y = 0; y < 21; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * rowHeight); //deplace le curseur de dessin de gauche
            ctx.lineTo(10 * columnWidth, y * rowHeight); //a droite
            ctx.stroke(); //dessine reellement les lignes
        }
        
        // On dessine les blocs
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 10; j++) {
                if (grid[i][j] !== 0) {
                    const id = grid[i][j];

                    let colorValue;
                    let color;
                
                    tableauDePieces.forEach(piece => {
                        if (piece.id === id) {
                            piece.shape.forEach((row, y) => {
                                row.forEach((value, x) => {
                                    if (value !== 0) {
                                        colorValue = value;
                                        color = piece.getColor(colorValue);
                                    }
                                })
                            })
                        }
                    })

                    ctx.fillStyle = color;
                    ctx.fillRect(j * columnWidth, i * rowHeight, columnWidth, rowHeight);
                }
            }
        }
    }

    // Genere une grille vide
    getEmptyGrid() {
        //Design du canvas
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
    //start the game
    start() {
        this.getEmptyGrid();
        this.getRandomPiece(grid);
    }

    //Pause the game
    pause() {
        clearInterval(this.intervalId);
    }
    

}

/***************** CLASSE MODELE  ************************/
class TetrisModel {

    constructor() {
        this.grid;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameOver = false;
        this.currentPiece;
    }
    
///////////////////// BIND MODELE  ////////////////////////////////
    bindgetEmptyGrid (callback) {
        // Définition d'une nouvelle propriété pouvant être utilisée à partir d'une instance de Model.
        this.getEmptyGrid = callback; // On veut pouvoir actualiser la View (depuis le Controller) quand nous récupérons les données.
    }

    bindupdateGrid (callback) {
        // Définition d'une nouvelle propriété pouvant être utilisée à partir d'une instance de Model.
        this.updateGrid = callback; // On veut pouvoir actualiser la View (depuis le Controller) quand nous récupérons les données.
    }

    bindremoveLine (callback) {
        // Définition d'une nouvelle propriété pouvant être utilisée à partir d'une instance de Model.
        this.removeLine = callback; // On veut pouvoir actualiser la View (depuis le Controller) quand nous récupérons les données.
    }

    bindgameOver (callback) {
        // Définition d'une nouvelle propriété pouvant être utilisée à partir d'une instance de Model.
        this.gameOver = callback; // On veut pouvoir actualiser la View (depuis le Controller) quand nous récupérons les données.
    }
    
///////////////////// FIN BIND MODELE  ////////////////////////////////

    //Fonction qui se lance au démarrage du jeu
    start() {
        this.getEmptyGrid();
    }

    //ecrit une fonction qui regarde si la piece peut etre inseree
    canInsertPiece() {
        let canInsert = true;
        this.currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    if (this.currentPiece.y + y < 0 || this.currentPiece.y + y > 19 || this.currentPiece.x + x < 0 || this.currentPiece.x + x > 9 || grid[this.currentPiece.y + y][this.currentPiece.x + x] !== 0) {
                        canInsert = false;
                    }
                }
            })
        })
        return canInsert;
    }

    gameOver() {
        alert("Game Over");
    }

    //Fonction qui met une piece aleatoire dans le jeu
    getRandomPiece(grid) {

        let date = new Date();
        let seed = date.getTime();

        const pieces = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
        this.currentPiece = new Piece(seed, pieces[Math.floor(Math.random() * pieces.length)], grid);
        this.currentPiece.insertPiece();
        this.updateGrid();
        this.drop();
        tableauDePieces.push(this.currentPiece);
    }

    // Fonction qui fait descendre les pieces
    moveDown() {
        let impossible = false;
        let points = [];

        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[0].length; col++) {
                if (grid[row][col] === this.currentPiece.id) {
                    // Ajoute le point à la liste des points
                    points.push({
                        row: row,
                        col: col,
                    })

                    // Supprime l'identifiant de la pièce de la grille
                    grid[row][col] = 0;
                }
            }
        }

        // On vérifie si la pièce peut être déplacée
        points.forEach((point) => {
            if(point.row === 19 || grid[point.row + 1][point.col] !== 0) {
                impossible = true;
            }
        })
        
        if(!impossible) {
            points.forEach((point) => {
                // On déplace la pièce d'une ligne vers le bas
                grid[point.row + 1][point.col] = this.currentPiece.id;
                this.currentPiece.position = { row: points[0].row + 1, col: points[0].col }
                this.updateGrid();
                return 1;
            })
        } else {
            points.forEach(point => {
                grid[point.row][point.col] = this.currentPiece.id;
            })
            return 0;
        }
    }

    //Fonction qui deplace la piece a droite
    moveRight() {
        let impossible = false;
        let points = [];

        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[0].length; col++) {
                if (grid[row][col] === this.currentPiece.id) {
                    // Ajoute le point à la liste des points
                    points.push({
                        row: row,
                        col: col,
                    })

                    // Supprime l'identifiant de la pièce de la grille
                    grid[row][col] = 0;
                }
            }
        }

        // On vérifie si la pièce peut être déplacée
        points.forEach((point) => {
            if(point.row === 19 || grid[point.row][point.col + 1] !== 0) {
                impossible = true;
            }
        })

        if(!impossible) {
            points.forEach((point) => {
                // On déplace la pièce d'une colonne vers la droite
                grid[point.row][point.col + 1] = this.currentPiece.id;
                this.currentPiece.position = { row: points[0].row, col: points[0].col + 1 }
                this.updateGrid();
                return 1;
            })
        } else {
            points.forEach(point => {
                grid[point.row][point.col] = this.currentPiece.id;
            })
            return 0;
        }
    }

    //Fonction qui deplace la piece a gauche
    moveLeft() {
        let impossible = false;
        let points = [];

        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[0].length; col++) {
                if (grid[row][col] === this.currentPiece.id) {
                    // Ajoute le point à la liste des points
                    points.push({
                        row: row,
                        col: col,
                    })

                    // Supprime l'identifiant de la pièce de la grille
                    grid[row][col] = 0;
                }
            }
        }

        // On vérifie si la pièce peut être déplacée
        points.forEach((point) => {
            if(point.row === 19 || grid[point.row][point.col - 1] !== 0) {
                impossible = true;
            }
        })
        
        if(!impossible) {
            points.forEach((point) => {
                // On déplace la pièce d'une colonne vers la gauche
                grid[point.row][point.col - 1] = this.currentPiece.id;
                this.currentPiece.position = { row: points[0].row, col: points[0].col - 1 }
                this.updateGrid();
                return 1;
            })
        } else {
            points.forEach(point => {
                grid[point.row][point.col] = this.currentPiece.id;
            })
            return 0;
        }
    }

    //Fonction qui permet de faire rotate la piece
    rotate() {
        let impossible = false;
        let points = [];

        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[0].length; col++) {
                if (grid[row][col] === this.currentPiece.id) {
                    // Ajoute le point à la liste des points
                    points.push({
                        row: row,
                        col: col,
                    })

                    // Supprime l'identifiant de la pièce de la grille
                    grid[row][col] = 0;
                }
            }
        }

        let newShape = [];
        for (let i = 0; i < this.currentPiece.shape[0].length; i++) {
            newShape[i] = [];
            for (let j = 0; j < this.currentPiece.shape.length; j++) {
                newShape[i][j] = this.currentPiece.shape[this.currentPiece.shape.length - j - 1][i];
            }
        }

        this.currentPiece.shape = newShape;

        // Via sa shape, on replace la pièce dans la grille
        for (let i = 0; i < this.currentPiece.shape.length; i++) {
            for (let j = 0; j < this.currentPiece.shape[0].length; j++) {
                if (this.currentPiece.shape[i][j] !== 0) {
                    grid[this.currentPiece.position.row + i][this.currentPiece.position.col + j] = this.currentPiece.id;
                }
            }
        }

        this.updateGrid();
    }

    
    drop() {    
        clearInterval(this.intervalId);
        this.intervalId = setInterval(() => {
            if(this.moveDown() === 0){
                this.getRandomPiece(grid);
                this.removeLine();
                this.updateGrid();
            }   
        }, 1000);
    }   
}
/*******************  FIN CLASSE MODELE  *********************/


export let tableauDePieces = [];


/*******************   CLASSE PIECE  *********************/
class Piece {
    constructor(id, type, grid_piece) {

        this.id = id;
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
    
    //Fonction qui permet de mettre de la couleur sur les pieces
    getColor(id) {
        switch (id) {
            case 1:
                return 'blue';
            case 2:
                return 'green';
            case 3:
                return 'red';
            case 4:
                return 'purple';
            case 5:
                return 'grey';
            case 6:
                return'yellow';
            case 7:
                return 'pink';
        }
    }

    insertPiece() {
        let gameOver = false;
        this.blocks.forEach(block => {
            if (grid[block.row][block.col] !== 0) {
                alert('Game Over');
                gameOver = true;
                return;
            }
        })
        if (!gameOver) {
            this.blocks.forEach(block => {
                grid[block.row][block.col] = this.id;
            })
        }
    }

    /*
    insertPiece() {
        this.blocks.forEach(block => {
            grid[block.row][block.col] = this.id;
        })
    }
    */

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
    /***************** FIN CLASSE PIECE  ************************/
}

const app = new Controller(new TetrisModel(), new TetrisView());