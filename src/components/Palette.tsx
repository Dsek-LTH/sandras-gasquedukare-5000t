import * as React from "react";
import { Table } from "./objects/Table";
import { observable } from "mobx";
import { observer } from "mobx-react";
import globalState from "../store";
import { DraggableData } from "react-draggable";

interface PaletteProps {

}

@observer
export class Palette extends React.Component<PaletteProps> {
	@observable tablePosition: any = {
		x: 20,
		y: 20,
	};

	ref: React.RefObject<HTMLDivElement>;

	constructor(props: PaletteProps) {
		super(props);
		this.ref = React.createRef();
	}

	render() {
		return (
			<div ref={this.ref}>
				<Table position={this.tablePosition} uuid={""} onStop={this.createTable.bind(this)}></Table>
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
	}
}