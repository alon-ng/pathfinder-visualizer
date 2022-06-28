import { Cell } from "./shared/Cell";
import { CELL_SIZE, CELL_GAP, CellType, Action } from "./shared/global-variables";

class Pathfinder {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	cells: Cell[][];
	isMouseDown: boolean;
	start: Cell;
	target: Cell;

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

		this.start = this.cells[0][0];
		this.start.type = CellType.Start;
		this.target = this.cells[this.cells.length - 1][this.cells[0].length - 1];
		this.target.type = CellType.Target;

		canvas.addEventListener("mousemove", (event) => this.handleMosueMove(event));
		canvas.addEventListener("mousedown", (event) => {
			this.isMouseDown = true;
			this.handleMosueMove(event);
		});
		canvas.addEventListener("mouseup", () => (this.isMouseDown = false));
	}

	onload() {
		this.renderCells();
	}

	handleMosueMove(event: MouseEvent) {
		const cell = this.getClickedOnCell(event);
		if (this.isMouseDown && cell) {
			const action = (document.querySelector('input[name="action"]:checked')! as HTMLInputElement).value;
			console.log(action);

			if (action === Action.DrawWalls) {
				if (cell.type !== CellType.Start && cell.type != CellType.Target) {
					cell.type = CellType.Wall;
				}
			} else if (action === Action.SetStart) {
				if (cell.type !== CellType.Target) {
					this.start.type = CellType.Empty;
					this.start.render();
					this.start = cell;
					this.start.type = CellType.Start;
				}
			} else if (action === Action.SetTarget) {
				if (cell.type !== CellType.Start) {
					this.target.type = CellType.Empty;
					this.target.render();
					this.target = cell;
					this.target.type = CellType.Target;
				}
			} else if (action === Action.Clear) {
				if (cell.type !== CellType.Start && cell.type != CellType.Target) {
					cell.type = CellType.Empty;
				}
			}
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
