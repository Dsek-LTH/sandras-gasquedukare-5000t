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
			  model={t}
			  key={t.uuid}/>
		);

		return (
			<div className="Floor" ref={this.ref}>
				{tables}
			</div>
		);
	}
}
