import * as React from "react";
import { Table } from "./objects/Table";
import { observable } from "mobx";
import { observer } from "mobx-react";
import globalState from "../store";
import { DraggableData } from "react-draggable";
import { ObjectModel } from "../model/ObjectModel";

interface PaletteProps {

}

@observer
export class Palette extends React.Component<PaletteProps> {
	@observable mannequinTable: ObjectModel = new ObjectModel();

	ref: React.RefObject<HTMLDivElement>;

	constructor(props: PaletteProps) {
		super(props);
		this.ref = React.createRef();
		this.mannequinTable.uuid = "";
		this.mannequinTable.groupUuid = "";
		this.mannequinTable.position = {
			x: 20,
			y: 20,
		};
	}

	render() {
		return (
			<div ref={this.ref}>
				<Table
				  model={this.mannequinTable}
				  onStop={this.createTable.bind(this)}/>
			</div>
		);
	}

	private createTable(event: any, data: DraggableData) {
		const bounding = this.ref.current.getBoundingClientRect();

		const position = {
			x: data.x + bounding.left - 1,
			y: data.y + bounding.top - 1,
		};

		globalState.createObject({
			position
		});

		this.mannequinTable.position.x = 20;
		this.mannequinTable.position.y = 20;
	}
}
