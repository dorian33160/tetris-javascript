import TetrisModel from "./modele.js";
import TetrisControl from './controller.js';
import TetrisView from './view.js';
import Piece from "./piece.js";

const canvas = document.getElementById('tetris-canvas');
const ctx = canvas.getContext('2d');

const game = new TetrisControl();

const view = new TetrisView(game);

const modele = new TetrisModel(view);