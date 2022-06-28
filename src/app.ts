import { Cell } from "./shared/Cell";
import { CELL_SIZE, CELL_GAP } from "./shared/global-variables";

class Pathfinder {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	cells: Cell[][];

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d")!;
		this.cells = [];

		for (let i = 0; i < Math.floor(canvas.height / (CELL_SIZE + CELL_GAP)); i++) {
			this.cells[i] = [];
			for (let j = 0; j < Math.floor(canvas.width / (CELL_SIZE + CELL_GAP)); j++) {
				let newCell = new Cell(i, j, this.ctx);
				this.cells[i][j] = newCell;
			}
		}
	}

	onload() {
		for (let i = 0; i < this.cells.length; i++) {
			for (let j = 0; j < this.cells[i].length; j++) {
				this.cells[i][j].render();
			}
		}
	}
}

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
export let pathfinder = new Pathfinder(canvas);

window.addEventListener("load", () => {
	pathfinder.onload();
});
