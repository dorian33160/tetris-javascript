class TetrisControl {
    constructor(modele, view){
        this.game = game;
        this.modele = modele;
        this.view = view;
        this.bindDisplayGrid = this.bindDisplayGrid.bind(this);
        this.model.bindDisplayGrid(this.bindDisplayGrid);
        
    }

    bindDisplayGrid (grid) {
    this.view.displayGrid(grid); // Il faut que display grid soit uen fonction qui appartienne a la vue
    }
    
}

//const app = new TetrisControl(new TetrisModel(), new TetrisView('mvc'));

export default TetrisControl