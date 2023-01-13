class Model {
      constructor() {
        this.URL = 'https://api.chucknorris.io/jokes/random';
        this.grid = [];

        this.play = this.play.bind(this);
      }
    
      // Binding.
      bindDisplayGrid (callback) {
        // Définition d'une nouvelle propriété pouvant être utilisée à partir d'une instance de Model.
        this.DisplayGrid = callback; // On veut pouvoir actualiser la View (depuis le Controller) quand nous récupérons les données.
      }

      play () {
        this.DisplayGrid(this.grid);
      }
    }
    
    class View {
      constructor(div_id) {
        this.div_id = div_id;
        this.p_tag;
        this.initView();
      }

      // Binding.
      bindGetCNF (callback) {
        this.getCNF = callback; // On veut pouvoir demander au Model (depuis le Controller) une nouvelle Chuck Norris Fact.
      }

      initView () {
        let div = document.querySelector(`#${this.div_id}`);
        this.p_tag = document.createElement('p');
        this.p_tag.innerHTML = 'Click to display a new Chuck Norris Fact.';
        let button = document.createElement('button');
        button.innerHTML = 'New Chuck Norris Fact';
        button.addEventListener('click', () => {
          this.getCNF();
        });
        div.appendChild(this.p_tag);
        div.appendChild(button);
      }
    
      displayGrid (cnf_value) {
        if (this.p_tag) {
          this.p_tag.innerHTML = cnf_value;
        }
      }
    }
    
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
        this.bindDisplayGrid = this.bindDisplayGrid.bind(this);
        this.model.bindDisplayGrid(this.bindDisplayGrid);

        setInterval(this.model.play, 10);
      }
      
      bindDisplayGrid (grid) {
        this.view.displayGrid(grid);
      }
    }

    const app = new Controller(new Model(), new View('mvc'));