import { observable, action, computed } from "mobx";
import * as uuid from "uuid";
import { string } from "prop-types";

interface ObjectModel {
	position: any;
	uuid: string;
}

class StateStore {
	@observable objects: { [key: string]: ObjectModel } = {};
	@observable values: {
		selected: string
	} = {
		selected: ""
	};

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
		const model = {
			uuid: uuid.v4(),
			position: partialModel.position,
		};

		this.objects[model.uuid] = model;
		return model;
	}
}

const globalState = new StateStore();
export default globalState;
