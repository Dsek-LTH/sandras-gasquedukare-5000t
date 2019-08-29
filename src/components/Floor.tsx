import * as React from "react";
import { observer } from "mobx-react";

import "./Floor.scss";
import globalState from "../store";
import { Table } from "./objects/Table";

@observer
export class Floor extends React.Component {
	private ref = React.createRef<HTMLDivElement>();

	render() {
		const tables = globalState.getObjects().map(t =>
			<Table
			  position={t.position}
			  onDrag={(e, data) => {
				globalState.getObject(t.uuid).position = {
					x: data.x, y: data.y
				}
			  }}
			  uuid={t.uuid}
			  groupUuid={t.groupUuid}
			  key={t.uuid}/>
		);

		return (
			<div className="Floor" ref={this.ref}>
				{tables}
			</div>
		);
	}
}
