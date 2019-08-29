import * as React from "react";
import Draggable, { DraggableData, DraggableEventHandler } from "react-draggable";

import "./Table.scss";

interface TableProps {
	uuid: string;
	position: any;
	onStop?: DraggableEventHandler;
	onDrag?: DraggableEventHandler;
}

export class Table extends React.Component<TableProps> {
	render() {
		return (
			<Draggable
			  position={this.props.position} 
			  onStop={this.props.onStop}
			  onDrag={this.props.onDrag}>
				<div className="Table">
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
}