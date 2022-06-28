import { CELL_SIZE, CELL_GAP, Color, CellType } from "./global-variables";

export class Cell {
	ctx: CanvasRenderingContext2D;
	index: { x: number; y: number };
	x: number;
	y: number;
	type: CellType;
	isVisited: boolean;
	value: number;

	constructor(x: number, y: number, ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
		this.index = { x: x, y: y };
		this.x = x * (CELL_SIZE + CELL_GAP);
		this.y = y * (CELL_SIZE + CELL_GAP);
		this.type = CellType.Empty;
		this.isVisited = false;
		this.value = -1;
	}

	render(): void {
		this.ctx.beginPath();
		this.ctx.fillStyle = this.getCellColor();

		this.ctx.fillRect(this.x, this.y, CELL_SIZE, CELL_SIZE);
		this.ctx.stroke();
	}

	getCellColor(): Color {
		if (this.isVisited) return Color.Aqua;
		switch (this.type) {
			case CellType.Empty:
				return Color.White;
			case CellType.Wall:
				return Color.Black;
			case CellType.Start:
				return Color.Green;
			case CellType.Target:
				return Color.Red;
			case CellType.Path:
				return Color.Gold;
			default:
				return Color.White;
		}
	}
}
