import * as React from "react";
import Draggable, { DraggableData, DraggableEventHandler, DraggableCore } from "react-draggable";

import "./Table.scss";
import globalState from "../../store";
import { action } from "mobx";
import { observer } from "mobx-react";
import { ObjectModel, meters } from "../../model/ObjectModel";

const SELECTED_COLOR = "#8080ff";
const SELECTED_GROUP_COLOR = "magenta";
const SNAP_GROUP_COLOR = "orange";

interface TableProps {
	parentOffset?: Position;
	model: ObjectModel;
	onStop?: DraggableEventHandler;
	onDrag?: DraggableEventHandler;
}

@observer
export class Table extends React.Component<TableProps> {
	private snapGroup = "";

	constructor(props: TableProps) {
		super(props);
		this.snapGroup = props.model.groupUuid;
	}

	render() {
		const model = this.props.model;
		const style: any = {};
		style.left = model.position.x;
		style.top = model.position.y;
		style.transform = `rotate(${model.rotation}rad)`;
		style.width = meters(model.width);
		style.height = meters(model.depth);
		style.marginLeft = -meters(model.width / 2);
		style.marginTop = -meters(model.depth / 2);

		//const areaStyle: any = {
		//	width: meters(model.width),
		//	height: meters(model.depth),
		//	marginLeft: -meters(model.width / 2),
		//	marginTop: -meters(model.depth / 2)
		//};

		if (model.uuid) {
			if (model.groupUuid == globalState.selectedGroup) {
				style.borderColor = SELECTED_GROUP_COLOR;
			}

			if (model.groupUuid == globalState.snapGroup) {
				style.borderColor = SNAP_GROUP_COLOR;
			}

			if (model.uuid == globalState.selected) {
				style.borderColor = SELECTED_COLOR;
			}
		}

		const seats = model.snapLocalOffsets.map((s, i) => 
			<div key={i} style={{
				//transform: `translate(${s.x}px, 0px)`,
				left: s.x + meters(model.width / 2),
				top: s.y + meters(model.depth / 2),
			}}/>
		);

		return (
			<DraggableCore
			  onStart={this.select.bind(this)}
			  onStop={this.onStop.bind(this)}
			  onDrag={this.onDrag.bind(this)}>
				<div className="Table" style={style}>
					<div className="seats">
						{ seats }
					</div>
				</div>
			</DraggableCore>
		);
	}

	@action
	private select() {
		if (!this.props.model.uuid) {
			return;
		}

		globalState.selected = this.props.model.uuid;
		globalState.selectedGroup = this.props.model.groupUuid;
	}

	@action
	private onStop(event: any, data: DraggableData) {
		globalState.getGroup(this.props.model.groupUuid).forEach(t => t.groupUuid = this.snapGroup);
		this.select();

		if (this.props.onStop) {
			this.props.onStop(event, data);
		}
	}

	@action
	private onDrag(event: any, data: DraggableData) {
		const model = this.props.model;

		const lastX = model.position.x;
		const lastY = model.position.y;
		model.position.x = data.x;
		model.position.y = data.y;

		if (model.uuid) {
			const snapPoint = globalState.snapObject(model);
			if (snapPoint) {
				model.position.x = snapPoint.x;
				model.position.y = snapPoint.y;

				this.snapGroup = globalState.getObject(snapPoint.uuid).groupUuid;
			}
			else {
				this.snapGroup = model.groupUuid;
			}
		}

		const deltaX = model.position.x - lastX;
		const deltaY = model.position.y - lastY;

		const group = globalState.getGroup(model.groupUuid);
		for (const table of group) {
			if (table.uuid === model.uuid) continue;
			table.position.x += deltaX;
			table.position.y += deltaY;
		}
	}
}
