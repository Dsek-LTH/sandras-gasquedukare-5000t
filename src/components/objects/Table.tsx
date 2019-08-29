import * as React from "react";
import Draggable, { DraggableData, DraggableEventHandler } from "react-draggable";

import "./Table.scss";
import globalState from "../../store";
import { action } from "mobx";
import { observer } from "mobx-react";

const SELECTED_COLOR = "#8080ff";
const SELECTED_GROUP_COLOR = "magenta";

interface TableProps {
	uuid: string;
	groupUuid: string;
	position: any;
	onStop?: DraggableEventHandler;
	onDrag?: DraggableEventHandler;
}

@observer
export class Table extends React.Component<TableProps> {
	render() {
		const style: any = {};

		if (this.props.uuid) {
			if (this.props.groupUuid == globalState.selectedGroup) {
				style.borderColor = SELECTED_GROUP_COLOR;
			}

			if (this.props.uuid == globalState.selected) {
				style.borderColor = SELECTED_COLOR;
			}
		}

		return (
			<Draggable
			  position={this.props.position} 
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
		if (!this.props.uuid) {
			return;
		}

		globalState.selected = this.props.uuid;
		globalState.selectedGroup = this.props.groupUuid;
	}
}