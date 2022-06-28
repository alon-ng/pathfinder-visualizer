import { CELL_SIZE, CELL_GAP } from "./global-variables";

export class Cell {
	ctx: CanvasRenderingContext2D;
	x: number;
	y: number;

	constructor(x: number, y: number, ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
		this.x = x;
		this.y = y;
	}

	render() {
		this.ctx.beginPath();
		this.ctx.fillStyle = "rgb(230, 230, 230)";
		this.ctx.fillRect(this.x * (CELL_SIZE + CELL_GAP), this.y * (CELL_SIZE + CELL_GAP), CELL_SIZE, CELL_SIZE);
		this.ctx.stroke();
	}
}
