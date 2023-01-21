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
export let ctx; //pour dessiner le canvas
export let grid = []; //grille de jeu

/***************** CLASSE VIEW  ************************/
class TetrisView {

    constructor() {
        this.score = 0; //score du joueur
        this.startButton = document.getElementById("start"); //bouton start
        this.pauseButton = document.getElementById("pause"); //bouton pause
        this.canvas = document.getElementById('tetris-canvas'); //canvas
        ctx = this.canvas.getContext('2d'); //pour dessiner le canvas
        this.getEmptyGrid(); //initiation de la grille

        this.startButton.addEventListener('click', () => { //evenement qui suit un click sur le bouton start
            this.start();
        });
        this.pauseButton.addEventListener('click', () => { //Détecte lorsque on clique sur pause
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

    //fonction qui permet d'augmenter le score
    increaseScore() {
        this.score = this.score + 100; // On ajoute 100 a chaque fois qu'une ligne est remplis et cassee
        document.getElementById("score").innerHTML = this.score; //Va cehrcher l'id score dans l'HTML pour afficher le score
    }

    //Fonction qui permet de supprimer la ligne lorsque elle est pleine et rajoute une ligne de zero en haut de la grille
    removeLine() {
        //boucle qui parcours les lignes de la grille
        for (let row = 0; row < grid.length; row++) {
            //Parcour chaque cellule de la ligne et verifie si elle est pleine
            let isRowFull = grid[row].every(function(cell) {
                return cell !== 0;
            });
            if (isRowFull) { //Si une ligne est pleine alors :
                grid.splice(row, 1); // On la supprime
                grid.unshift(Array(10).fill(0)); // On en rajoute une nouvelle en haut du canvas
                this.increaseScore(); //Appelle fonction pour augmenter le score
            }
        }
    }

    //Permet de mettre a jour la grille
    updateGrid() {
        // On recree la grille
        ctx.fillStyle = ctx.background;
        ctx.fillRect(0, 0, 350, 640);

        //permet de calculer la taille exacte des cellules
        let columnWidth = 350/10;
        let rowHeight = 640/20;

        // Dessine les lignes verticales de la grille
        for (let x = 0; x < 11; x++) {
            ctx.beginPath(); //Permet de demarrer un nouveau chemin pour dessiner sur un canvas
            ctx.moveTo(x * columnWidth, 0); //deplace le curseur de dessin de haut
            ctx.lineTo(x * columnWidth, 20 * rowHeight); // en bas
            ctx.stroke(); //dessine reellement les colonnes
        }

        // Dessine les lignes horizontales de la grille
        for (let y = 0; y < 21; y++) {
            ctx.beginPath(); //Permet de demarrer un nouveau chemin pour dessiner sur un canvas
            ctx.moveTo(0, y * rowHeight); //deplace le curseur de dessin de gauche
            ctx.lineTo(10 * columnWidth, y * rowHeight); //a droite
            ctx.stroke(); //dessine reellement les lignes
        }
        
        // On dessine les blocs de la piece qui sont dans la grille
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 10; j++) {
                if (grid[i][j] !== 0) { //Si la cellule n'est pas vide
                    const id = grid[i][j]; //On recupere l'id de la piece

                    let colorValue;
                    let color;
                
                    tableauDePieces.forEach(piece => { //On parcours le tableau de pieces
                        if (piece.id === id) { //Si l'id de la piece est egal a l'id de la piece dans la grille
                            piece.shape.forEach((row, y) => { //On parcours la forme de la piece
                                row.forEach((value, x) => { //On parcours la forme de la piece
                                    if (value !== 0) { //Si la cellule n'est pas vide
                                        colorValue = value; //On recupere la valeur de la cellule
                                        color = piece.getColor(colorValue); //On recupere la couleur de la cellule
                                    }
                                })
                            })
                        }
                    })

                    ctx.fillStyle = color; //On definit la couleur de la cellule
                    ctx.fillRect(j * columnWidth, i * rowHeight, columnWidth, rowHeight); //On dessine la cellule
                }
            }
        }
    }

    // Genere une grille vide
    getEmptyGrid() {
        //Design du canvas
        ctx.strokeStyle = 'red'; //Couleur des lignes
        ctx.lineWidth = 0.5; //Epaisseur des lignes
        ctx.background = 'white'; // Couleur de l'interieur de la grille
        ctx.fillStyle = ctx.background;
        ctx.fillRect(0, 0, 350, 640); // (x, y, largeur, hauteur)
        
        //Fonction qui crée une nouvelle ligne dans le tableau grid
        for (let i = 0; i < 20; i++) {  
            grid[i] = new Array(10).fill(0); //Elle crée un tableau de taille 10 et le rempli avec des 0.
        }
        
        //Initialisation de la taille des lignes et colonnes 
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
        this.updateGrid = callback;
    }

    bindremoveLine (callback) {
        this.removeLine = callback;
    }

    bindgameOver (callback) {
        this.gameOver = callback;
    }
    
///////////////////// FIN BIND MODELE  ////////////////////////////////

    //Fonction qui se lance au démarrage du jeu
    start() {
        this.getEmptyGrid(); //On genere une grille vide
    }

    //Vérifie si on peut insérer une nouvelle piece dans la grille
    canInsertPiece() {
        let canInsert = true; //Insertion possible ou non
        this.currentPiece.shape.forEach((row, y) => { //On parcours la forme de la piece
            row.forEach((value, x) => { //On parcours la forme de la piece
                if (value !== 0) { //Si la cellule n'est pas vide
                    if (this.currentPiece.y + y < 0 || //Si la piece sort de la grille
                        this.currentPiece.y + y > 19 || //Si la piece sort de la grille
                        this.currentPiece.x + x < 0 || //Si la piece sort de la grille
                        this.currentPiece.x + x > 9 || //Si la piece sort de la grille
                        grid[this.currentPiece.y + y][this.currentPiece.x + x] !== 0) { //Si la piece est sur une autre piece
                        canInsert = false; //On ne peut pas insérer la piece
                    }
                }
            })
        })
        return canInsert; //On retourne si on peut insérer la piece ou non
    }

    //Fonction qui permet d'afficher un popup de fin de partie
    gameOver() {
        alert("Game Over");
    }

    //Fonction qui met une piece aleatoire dans le jeu
    getRandomPiece(grid) {

        let date = new Date(); //On instancie un objet de type date
        let seed = date.getTime(); //On récupère le timestamp Unix qui nous servira pour les id des pieces

        const pieces = ['I', 'J', 'L', 'O', 'S', 'T', 'Z']; //On définit les types de pieces disponibles
        this.currentPiece = new Piece(seed, pieces[Math.floor(Math.random() * pieces.length)], grid); //On instancie une nouvelle piece avec un id aléatoire et un type aléatoire
        this.currentPiece.insertPiece(); //On insère la piece dans la grille
        this.updateGrid(); //On met à jour la grille
        this.drop(); //On fait descendre la piece
        tableauDePieces.push(this.currentPiece); //On ajoute la piece dans le tableau de pieces pour pouvoir gérer les pièces
    }

    // Fonction qui fait descendre les pieces
    moveDown() {
        let impossible = false; //On initialise une variable qui nous permettra de savoir si la piece peut être déplacée ou non
        let points = []; //On initialise un tableau qui contiendra les points de la piece

        for (let row = 0; row < grid.length; row++) { //On parcours la grille
            for (let col = 0; col < grid[0].length; col++) { //On parcours la grille
                if (grid[row][col] === this.currentPiece.id) { //Si la cellule contient l'id de la piece
                    // Ajoute le point à un tableau de points
                    points.push({
                        row: row,
                        col: col,
                    })

                    //Supprime la piece de la grille en attendant les prochaines vérifications
                    grid[row][col] = 0;
                }
            }
        }

        // On vérifie si la pièce peut être déplacée
        points.forEach((point) => { //On parcours les points de la piece
            if(point.row === 19 || grid[point.row + 1][point.col] !== 0) { //Si la piece est sur le bas de la grille ou sur une autre piece
                impossible = true; //On ne peut pas déplacer la piece
            }
        })
        
        if(!impossible) {
            points.forEach((point) => { //On parcours les points de la piece
                
                grid[point.row + 1][point.col] = this.currentPiece.id; //On déplace la piece d'une ligne vers le bas
                this.currentPiece.position = { row: points[0].row + 1, col: points[0].col } //On met à jour la position de la piece
                this.updateGrid(); //On met à jour la grille
                return 1; //On retourne 1 pour dire que la piece a été déplacée
            })
        } else {
            points.forEach(point => { //On parcours les points de la piece
                grid[point.row][point.col] = this.currentPiece.id; //On remet la piece à sa position d'origine
            })
            return 0; //On retourne 0 pour dire que la piece n'a pas été déplacée
        }
    }

    //Fonction qui deplace la piece a droite
    moveRight() {
        let impossible = false; //On initialise une variable qui nous permettra de savoir si la piece peut être déplacée ou non
        let points = []; //On initialise un tableau qui contiendra les points de la piece

        for (let row = 0; row < grid.length; row++) { //On parcours la grille
            for (let col = 0; col < grid[0].length; col++) { //On parcours la grille
                if (grid[row][col] === this.currentPiece.id) { //Si la cellule contient l'id de la piece
                    // Ajoute le point à la liste des points
                    points.push({
                        row: row,
                        col: col,
                    })

                    // Supprime la pièce de la grille en attendant les prochaines vérifications
                    grid[row][col] = 0;
                }
            }
        }

        // On vérifie si la pièce peut être déplacée
        points.forEach((point) => { //On parcours les points de la piece
            if(point.row === 19 || grid[point.row][point.col + 1] !== 0) { //Si la piece est sur le bas de la grille ou sur une autre piece
                impossible = true; //On ne peut pas déplacer la piece
            }
        })

        if(!impossible) { //Si on peut déplacer la piece
            points.forEach((point) => { //On parcours les points de la piece

                grid[point.row][point.col + 1] = this.currentPiece.id; //On déplace la piece d'une colonne vers la droite
                this.currentPiece.position = { row: points[0].row, col: points[0].col + 1 } //On met à jour la position de la piece
                this.updateGrid(); //On met à jour la grille
                return 1; //On retourne 1 pour dire que la piece a été déplacée
            })
        } else {
            points.forEach(point => { //On parcours les points de la piece
                grid[point.row][point.col] = this.currentPiece.id; //On remet la piece à sa position d'origine
            })
            return 0; //On retourne 0 pour dire que la piece n'a pas été déplacée
        }
    }

    /* MEME CHOSE QUE POUR MOVE DOWN et MOVE RIGHT*/

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

    //Fonction qui permet de faire tourner la piece
    rotate() {
        let points = []; //On initialise un tableau qui contiendra les points de la piece

        for (let row = 0; row < grid.length; row++) { //On parcours la grille
            for (let col = 0; col < grid[0].length; col++) { //On parcours la grille
                if (grid[row][col] === this.currentPiece.id) { //Si la cellule contient l'id de la piece
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

        let newShape = []; //On initialise un tableau qui contiendra la nouvelle forme de la piece
        for (let i = 0; i < this.currentPiece.shape[0].length; i++) { //On parcours la forme de la piece
            newShape[i] = []; //On crée un tableau pour chaque ligne de la forme de la piece
            for (let j = 0; j < this.currentPiece.shape.length; j++) { //On parcours la forme de la piece
                newShape[i][j] = this.currentPiece.shape[this.currentPiece.shape.length - j - 1][i]; //On crée la nouvelle forme de la piece en inversant les lignes et les colonnes
            }
        }

        this.currentPiece.shape = newShape; //On met à jour la forme de la piece

        for (let i = 0; i < this.currentPiece.shape.length; i++) { //On parcours la forme de la piece
            for (let j = 0; j < this.currentPiece.shape[0].length; j++) { //On parcours la forme de la piece
                if (this.currentPiece.shape[i][j] !== 0) { //Si la cellule de la forme de la piece n'est pas vide
                    grid[this.currentPiece.position.row + i][this.currentPiece.position.col + j] = this.currentPiece.id; //On met à jour la grille avec la nouvelle forme de la piece
                }
            }
        }

        this.updateGrid(); //On met à jour la grille
    }

    
    drop() {    
        clearInterval(this.intervalId); //On arrête le timer
        this.intervalId = setInterval(() => { //On relance le timer
            if(this.moveDown() === 0){ //Si la piece ne peut pas être déplacée vers le bas
                this.getRandomPiece(grid); //On récupère une nouvelle pièce
                this.removeLine(); //On supprime les lignes
                this.updateGrid(); //On met à jour la grille
            }   
        }, 1000); //On met à jour le timer toutes les secondes
    }   
}
/*******************  FIN CLASSE MODELE  *********************/


export let tableauDePieces = []; //On initialise un tableau qui contiendra les pièces


/*******************   CLASSE PIECE  *********************/
class Piece {
    constructor(id, type, grid_piece) {

        this.id = id;
        this.type = type;
        grid = grid_piece;
        this.position = { x: 3, y: 0 }; //On initialise la position de la piece
        this.rotation = 0; //On initialise la rotation de la piece
        this.shape = this.getShape(); //On récupère la forme de la piece
        this.cols = this.shape[0].length; //On récupère le nombre de colonnes de la forme de la piece
        this.rows = this.shape.length; //On récupère le nombre de lignes de la forme de la piece
        this.blocks = []; //On initialise un tableau qui contiendra les blocs de la piece
        for (let i = 0; i < this.rows; i++) { //On parcours la forme de la piece
            for (let j = 0; j < this.cols; j++) { //On parcours la forme de la piece
                // Si la case est pleine
                if (this.shape[i][j] !== 0) {
                    // Ajoute le bloc à la liste des blocs
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
        let gameOver = false; //On initialise gameOver à false
        this.blocks.forEach(block => { //On parcours les blocs de la piece
            if (grid[block.row][block.col] !== 0) { //Si la case de la grille n'est pas vide
                alert('Game Over'); //On affiche le popup Game Over
                gameOver = true; //On met gameOver à true
                return; //On sort de la fonction
            }
        })
        if (!gameOver) { //Si gameOver est à false
            this.blocks.forEach(block => { //On parcours les blocs de la piece
                grid[block.row][block.col] = this.id; //On met à jour la grille avec la nouvelle forme de la piece
            })
        }
    }

    /* placePiece parcourt la forme de la pièce et vérifie si chaque case est vide. 
    Si elle est vide, il passe à la case suivante. 
    Sinon, il met à jour la grille avec la nouvelle forme de la pièce en utilisant les coordonnées x et y de sa position actuelle.*/

    placePiece() {
        for (let y = 0; y < this.shape.length; y++) { //On parcours la forme de la piece
            for (let x = 0; x < this.shape[y].length; x++) { //On parcours la forme de la piece
                if (this.shape[y][x] === 0) { //Si la case de la forme de la piece est vide
                    continue; //On passe à la case suivante
                }
                this.grid[this.position.y + y][this.position.x + x] = this.type; //On met à jour la grille avec la nouvelle forme de la piece
            }
        }
    }
    /***************** FIN CLASSE PIECE  ************************/
}

const app = new Controller(new TetrisModel(), new TetrisView());