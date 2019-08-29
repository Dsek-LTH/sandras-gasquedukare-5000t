import * as React from "react";
import Draggable, { DraggableData, DraggableEventHandler, DraggableCore } from "react-draggable";

import "./Table.scss";
import globalState, { ObjectModel } from "../../store";
import { action } from "mobx";
import { observer } from "mobx-react";

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

		return (
			<DraggableCore
			  onStart={this.select.bind(this)}
			  onStop={this.onStop.bind(this)}
			  onDrag={this.onDrag.bind(this)}>
				<div className="Table" style={style}>
					<div className="seats">
						<div className="top"/>
						<div className="right"/>
						<div className="bottom"/>
						<div className="left"/>
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
		this.props.model.groupUuid = this.snapGroup;
		this.select();

		if (this.props.onStop) {
			this.props.onStop(event, data);
		}
	}

	@action
	private onDrag(event: any, data: DraggableData) {
		this.props.model.position.x = data.x;
		this.props.model.position.y = data.y;

		if (this.props.model.uuid) {
			const snapPoint = globalState.snapObject(this.props.model);
			if (snapPoint) {
				this.props.model.position.x = snapPoint.x;
				this.props.model.position.y = snapPoint.y;

				this.snapGroup = globalState.getObject(snapPoint.uuid).groupUuid;
			}
		}
		else {
			this.snapGroup = this.props.model.groupUuid;
		}
	}
}
