import { Vector, rotate, normalize } from "../vector";
import { observable, computed } from "mobx";
import * as uuid from "uuid";

export const METER = 64;
export const meters = (m: number) => m * METER;

export class ObjectModel {
	@observable position: Vector;
	@observable rotation: number;

	uuid: string;
	groupUuid: string;
	
	width: number = 1.83;
	depth: number = 0.76;

	snaps: Vector[] = [
		//{
		//	x: -this.width / 2 + this.depth / 2, y: -this.depth / 2,
		//},
		//{
		//	x: this.width / 2 - this.depth / 2, y: -this.depth / 2,
		//},
		{
			x: this.width / 2, y: 0,
		},
		//{
		//	x: -this.width / 2 + this.depth / 2, y: this.depth / 2,
		//},
		//{
		//	x: this.width / 2 - this.depth / 2, y: this.depth / 2,
		//},
		{
			x: -this.width / 2, y: 0,
		},
	];

	seats: Vector[] = [
		{
			x: -this.width * 3 / 10, y: -this.depth / 2,
		},
		{
			x: 0, y: -this.depth / 2,
		},
		{
			x: this.width * 3 / 10, y: -this.depth / 2,
		},
		{
			x: this.width / 2, y: 0,
		},
		{
			x: this.width * 3 / 10, y: this.depth / 2,
		},
		{
			x: 0, y: this.depth / 2,
		},
		{
			x: -this.width * 3 / 10, y: this.depth / 2,
		},
		{
			x: -this.width / 2, y: 0,
		},
	];

	public snapLocalNormals: Vector[] = [
		//{ x: 0, y: -1 },
		//{ x: 0, y: -1 },
		{ x: 1, y: 0 },
		//{ x: 0, y: 1 },
		//{ x: 0, y: 1 },
		{ x: -1, y: 0 },
	]

	constructor() {
		this.uuid = uuid.v4();
		this.groupUuid = uuid.v4();
		this.rotation = 0;
	}

	get snapLocalOffsets(): Vector[] {
		return this.snaps.map(o => ({ x: meters(o.x), y: meters(o.y) }));
	}

	get snapOffsets(): Vector[] {
		return this.snapLocalOffsets.map(o => rotate(o, this.rotation));
	}

	get snapNormals(): Vector[] {
		return this.snapLocalNormals.map(o => rotate(o, this.rotation));
	}

	@computed
	get snapPositions(): (Vector & { index: number, uuid: string, normal: Vector })[] {
		return this.snapOffsets.map((o, i) => ({
			x: o.x + this.position.x,
			y: o.y + this.position.y,
			uuid: this.uuid,
			index: i,
			normal: normalize(o),
		}));
	}

	get seatLocalOffsets(): Vector[] {
		return this.seats.map(o => ({ x: meters(o.x), y: meters(o.y) }));
	}

	get seatOffsets(): Vector[] {
		return this.seatLocalOffsets.map(o => rotate(o, this.rotation));
	}
}
