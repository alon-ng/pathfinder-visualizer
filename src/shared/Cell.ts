import { CELL_SIZE, CELL_GAP, Color, CellType } from "./global-variables";

export class Cell {
	ctx: CanvasRenderingContext2D;
	x: number;
	y: number;
	type: CellType;

	constructor(x: number, y: number, ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
		this.x = x * (CELL_SIZE + CELL_GAP);
		this.y = y * (CELL_SIZE + CELL_GAP);
		this.type = CellType.Empty;
	}

	render() {
		this.ctx.beginPath();
		this.ctx.fillStyle = this.getCellColor();
		this.ctx.fillRect(this.x, this.y, CELL_SIZE, CELL_SIZE);
		this.ctx.stroke();
	}

	getCellColor() {
		switch (this.type) {
			case CellType.Empty:
				return Color.White;
			case CellType.Wall:
				return Color.Black;
			case CellType.Start:
				return Color.Green;
			case CellType.Target:
				return Color.Red;
		}
	}
}
