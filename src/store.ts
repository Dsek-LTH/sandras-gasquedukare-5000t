import { observable, action, computed } from "mobx";
import { delta, rotate, normalize, getAngle, multiply, Vector } from "./vector";
import { ObjectModel } from "./model/ObjectModel";

class StateStore {
	@observable objects: { [key: string]: ObjectModel } = {};
	@observable selected: string = "";
	@observable selectedGroup: string = "";
	@observable snapGroup: string = "";

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
		model.groupUuid = partialModel.groupUuid || model.groupUuid;

		this.objects[model.uuid] = model;
		this.selected = model.uuid;
		this.selectedGroup = model.groupUuid;
		return model;
	}

	snapPoint(point: Vector, index: number, skipGroupUuid: string) {
		let points = [];
		for (let o of this.getObjects()) {
			if (o.groupUuid === skipGroupUuid) continue;
			points.push(...(o.snapPositions.map(p => ({ ...p, index: index }))));
		}

		points = points.filter(a => distance(point, a) < 20);
		//points.sort((a, b) => distance(point, a) - distance(point, b));

		if (points.length > 0) {
			return points[0];
		}
		else {
			return null;
		}
	}

	@action
	snapObject(object: ObjectModel) {
		let points = object.snapPositions.map(
			(p, i) => this.snapPoint(p, i, object.groupUuid)
		).filter(p => p !== null);

		if (points.length > 0) {
			this.snapGroup = this.getObject(points[0].uuid).groupUuid;
			const point = points[0];

			// Rotate object (group) so that the snapped points normals
			// are opposite those of the snappee.
			const snappeeNormalAngle = getAngle(multiply(point.normal, -1));
			const snapperNormalAngle = getAngle(object.snapNormals[point.index]);
			const deltaAngle = snappeeNormalAngle - snapperNormalAngle;
			console.log(object.rotation + deltaAngle);
			this.setRotation(object.uuid, object.rotation + deltaAngle);

			const offset = object.snapOffsets[point.index];
			point.x -= offset.x;
			point.y -= offset.y;
			return point;
		}
		else {
			this.snapGroup = "";
			return null;
		}
	}

	getGroup(groupUuid: string): ObjectModel[] {
		return this.getObjects().filter(o => o.groupUuid === groupUuid);
	}

	setRotation(uuid: string, angle: number) {
		const object = this.getObject(uuid);
		const deltaAngle = angle - object.rotation;
		object.rotation = angle;

		const group = this.getGroup(object.groupUuid);
		for (const member of group) {
			if (member.uuid === uuid) continue;
			const d = delta(object.position, member.position);
			const rotated = rotate(d, deltaAngle);
			member.rotation += deltaAngle;
			member.position = {
				x: object.position.x + rotated.x,
				y: object.position.y + rotated.y,
			};
		}
	}
}

function distance(a: Vector, b: Vector): number {
	return Math.hypot(b.x - a.x, b.y - a.y);
}

const globalState = new StateStore();
export default globalState;
