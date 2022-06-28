import { Cell } from "./shared/Cell";
import { CELL_SIZE, CELL_GAP, CellType } from "./shared/global-variables";

class Pathfinder {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	cells: Cell[][];
	isMouseDown: boolean;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d")!;
		this.cells = [];
		this.isMouseDown = false;

		for (let i = 0; i < Math.floor(canvas.height / (CELL_SIZE + CELL_GAP)); i++) {
			this.cells[i] = [];
			for (let j = 0; j < Math.floor(canvas.width / (CELL_SIZE + CELL_GAP)); j++) {
				let newCell = new Cell(j, i, this.ctx);
				this.cells[i][j] = newCell;
			}
		}

		canvas.addEventListener("mousemove", (event) => this.handleMosueMove(event));
		canvas.addEventListener("mousedown", () => (this.isMouseDown = true));
		canvas.addEventListener("mouseup", () => (this.isMouseDown = false));
	}

	onload() {
		this.renderCells();
	}

	handleMosueMove(event: MouseEvent) {
		const cell = this.getClickedOnCell(event);
		if (this.isMouseDown && cell) {
			cell.type = CellType.Wall;
			cell.render();
		}
	}

	/* Returns the cell on which the mouse is over, if there is none returns undefined. */
	getClickedOnCell(event: MouseEvent): Cell | undefined {
		const rect = this.canvas.getBoundingClientRect();
		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;

		for (let i = 0; i < this.cells.length; i++) {
			for (let j = 0; j < this.cells[i].length; j++) {
				const cell = this.cells[i][j];

				// Check if click coordinates is inside the cell bounderies.
				if (mouseX > cell.x && mouseX < cell.x + CELL_SIZE && mouseY > cell.y && mouseY < cell.y + CELL_SIZE) {
					return cell;
				}
			}
		}
	}

	renderCells() {
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
