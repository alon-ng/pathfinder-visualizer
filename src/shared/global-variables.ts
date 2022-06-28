export const CELL_SIZE = 30;
export const CELL_GAP = 2;

export enum Color {
	White = "rgb(230, 230, 230)",
	Black = "rgb(30, 30, 30)",
	Red = "rgb(200, 0, 0)",
	Green = "rgb(25, 130, 10)",
	Aqua = "rgb(0, 180, 200)",
	Gold = "rgb(200, 140, 20)",
}

export enum CellType {
	Empty,
	Wall,
	Start,
	Target,
	Path,
}

export enum Action {
	DrawWalls = "create-walls",
	SetStart = "set-start",
	SetTarget = "set-target",
	Clear = "clear-walls",
}
