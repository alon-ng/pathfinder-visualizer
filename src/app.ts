import { Cell } from "./shared/Cell";
import { CELL_SIZE, CELL_GAP, CellType, Action, Color } from "./shared/global-variables";

class Simualator {
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

		this.removeOverflowCanvas();

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

	simulateDijkstraAlgorithm() {
		this.resetCells();
		let interval = setInterval(step, 100);
		this.start.value = 0;
		let nextCells = [this.start];
		this.start.isVisited = true;
		let simulator = this;

		function step() {
			// If no more steps available stop the clear the interval
			if (nextCells.length === 0) clearInterval(interval);
			const cellsToCheck = [...nextCells];
			nextCells = [];

			for (const cell of cellsToCheck) {
				if (cell.type === CellType.Target) {
					clearInterval(interval);
					drawPath();
					return;
				}
				let index = cell.index;

				index.x > 0 && tryVisitCell(simulator.cells[index.y][index.x - 1], cell.value + 1);
				index.y > 0 && tryVisitCell(simulator.cells[index.y - 1][index.x], cell.value + 1);
				index.x < Math.floor(canvas.width / (CELL_SIZE + CELL_GAP)) &&
					tryVisitCell(simulator.cells[index.y][index.x + 1], cell.value + 1);
				index.y < Math.floor(canvas.height / (CELL_SIZE + CELL_GAP)) &&
					tryVisitCell(simulator.cells[index.y + 1][index.x], cell.value + 1);
			}
			simulator.renderCells();
		}

		function tryVisitCell(cell: Cell, value: number) {
			if (cell.type !== CellType.Wall && !cell.isVisited) {
				cell.isVisited = true;
				cell.value = value;
				cell.render(Color.Purple);
				nextCells.push(cell);
			}
		}

		function drawPath() {
			let path: Cell[] = [simulator.target];
			let top = path[path.length - 1];

			while (top.type !== CellType.Start) {
				top.type = CellType.Path;
				let index = top.index;

				let minCell = new Cell(-1, -1, simulator.ctx);
				minCell.value = Infinity;

				if (index.x > 0) {
					let cell = simulator.cells[index.y][index.x - 1];
					if (cell.value !== -1 && cell.value < minCell.value) {
						minCell = cell;
					}
				}

				if (index.y > 0) {
					let cell = simulator.cells[index.y - 1][index.x];
					if (cell.value !== -1 && cell.value < minCell.value) {
						minCell = cell;
					}
				}

				if (index.x < Math.floor(canvas.width / (CELL_SIZE + CELL_GAP)) - 1) {
					let cell = simulator.cells[index.y][index.x + 1];
					if (cell.value !== -1 && cell.value < minCell.value) {
						minCell = cell;
					}
				}

				if (index.y < Math.floor(canvas.height / (CELL_SIZE + CELL_GAP)) - 1) {
					let cell = simulator.cells[index.y + 1][index.x];
					if (cell.value !== -1 && cell.value < minCell.value) {
						minCell = cell;
					}
				}

				path.push(minCell);
				top = path[path.length - 1];
			}
			path[0].type = CellType.Target;

			for (let i = 0; i < simulator.cells.length; i++) {
				for (let j = 0; j < simulator.cells[i].length; j++) {
					simulator.cells[i][j].isVisited = false;
				}
			}

			simulator.renderCells();
		}
	}

	resetCells() {
		for (let i = 0; i < this.cells.length; i++) {
			for (let j = 0; j < this.cells[i].length; j++) {
				this.cells[i][j].isVisited = false;
				this.cells[i][j].value = -1;
				if (this.cells[i][j].type === CellType.Path) {
					this.cells[i][j].type = CellType.Empty;
				}
			}
		}
	}

	removeOverflowCanvas() {
		let height = this.cells.length * (CELL_SIZE + CELL_GAP);
		let width = this.cells[0].length * (CELL_SIZE + CELL_GAP);
		this.canvas.height = height - 2;
		this.canvas.width = width - 2;
	}
}

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
export let simulator = new Simualator(canvas);

window.addEventListener("load", () => {
	simulator.onload();
});
