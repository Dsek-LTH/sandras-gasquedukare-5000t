import * as React from "react";
import Draggable, { DraggableData, DraggableEventHandler } from "react-draggable";

import "./Table.scss";
import globalState, { ObjectModel } from "../../store";
import { action } from "mobx";
import { observer } from "mobx-react";

const SELECTED_COLOR = "#8080ff";
const SELECTED_GROUP_COLOR = "magenta";

interface TableProps {
	model: ObjectModel;
	onStop?: DraggableEventHandler;
	onDrag?: DraggableEventHandler;
}

@observer
export class Table extends React.Component<TableProps> {
	render() {
		const model = this.props.model;
		const style: any = {};

		if (model.uuid) {
			if (model.groupUuid == globalState.selectedGroup) {
				style.borderColor = SELECTED_GROUP_COLOR;
			}

			if (model.uuid == globalState.selected) {
				style.borderColor = SELECTED_COLOR;
			}
		}

		return (
			<Draggable
			  position={model.position} 
			  onStart={this.select.bind(this)}
			  onStop={this.props.onStop}
			  onDrag={this.props.onDrag}>
				<div className="Table" style={style}>
					<div className="seats">
						<div className="top"/>
						<div className="right"/>
						<div className="bottom"/>
						<div className="left"/>
					</div>
				</div>
			</Draggable>
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
	private onDrag(event: any, data: DraggableData) {
		this.props.model.position.x = data.x;
		this.props.model.position.y = data.y;
	}
}
