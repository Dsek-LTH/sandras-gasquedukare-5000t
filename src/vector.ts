import { Vector } from "./store";

export function distance(a: Vector, b: Vector): number {
	return Math.hypot(b.x - a.x, b.y - a.y);
}

export function delta(a: Vector, b: Vector): Vector {
	return {
		x: b.x - a.x,
		y: b.y - a.y,
	};
}

export function normalize(vector: Vector): Vector {
	return multiply(vector, 1 / getMagnitude(vector));
}

export function fromAngle(angle: number): Vector {
	return {
		x: Math.cos(angle),
		y: Math.sin(angle),
	};
}

export function multiply(vector: Vector, scalar: number): Vector {
	return {
		x: vector.x * scalar,
		y: vector.y * scalar,
	};
}

export function getMagnitude(vector: Vector): number {
	return Math.hypot(vector.x, vector.y);
}

export function getAngle(vector: Vector): number {
	return Math.atan2(vector.y, vector.x);
}

export function rotate(vector: Vector, deltaAngle: number): Vector {
	const m = getMagnitude(vector);
	const a = getAngle(vector) + deltaAngle;
	return multiply(fromAngle(a), m);
}
