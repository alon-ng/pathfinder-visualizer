import { CELL_SIZE, CELL_GAP, Color } from "./global-variables";

export class Cell {
	ctx: CanvasRenderingContext2D;
	x: number;
	y: number;
	isWall: boolean;

	constructor(x: number, y: number, ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
		this.x = x * (CELL_SIZE + CELL_GAP);
		this.y = y * (CELL_SIZE + CELL_GAP);
		this.isWall = false;
	}

	render() {
		this.ctx.beginPath();
		this.ctx.fillStyle = this.isWall ? Color.black : Color.white;
		this.ctx.fillRect(this.x, this.y, CELL_SIZE, CELL_SIZE);
		this.ctx.stroke();
	}
}
