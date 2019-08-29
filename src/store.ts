import { observable, action, computed } from "mobx";
import * as uuid from "uuid";
import { string } from "prop-types";

interface Position {
	x: number;
	y: number;
}

export class ObjectModel {
	position: Position;
	uuid: string;
	groupUuid: string;

	constructor() {
		this.uuid = uuid.v4();
		this.groupUuid = uuid.v4();
	}

	@computed
	get seatPositions(): Position[] {
		const offsets = [
			{
				x: 16, y: 0,
			},
			{
				x: 32, y: 16,
			},
			{
				x: 16, y: 32,
			},
			{
				x: 0, y: 16,
			},
		];

		return offsets.map(o => ({
			x: o.x + this.position.x,
			y: o.y + this.position.y,
		}));
	}
}

class StateStore {
	@observable objects: { [key: string]: ObjectModel } = {};
	@observable selected: string = "";
	@observable selectedGroup: string = "";

	constructor() {
	}
	
	public getObject(uuid: string): ObjectModel {
		return this.objects[uuid];
	}

	public getObjects(): ObjectModel[] {
		return Object.values(this.objects);
	}

	@action
	public createObject(partialModel: Partial<ObjectModel>): ObjectModel {
		const model = new ObjectModel();
		model.position = partialModel.position;

		this.objects[model.uuid] = model;
		this.selected = model.uuid;
		this.selectedGroup = model.groupUuid;
		return model;
	}
}

const globalState = new StateStore();
export default globalState;
