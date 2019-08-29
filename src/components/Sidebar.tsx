import * as React from "react";
import { observer } from "mobx-react";
import * as uuid from "uuid";

import "./Sidebar.scss";
import { Palette } from "./Palette";
import globalState from "../store";

@observer
export class Sidebar extends React.Component {
	render() {
		const rotation = globalState.selected
			? globalState.getObject(globalState.selected).rotation / Math.PI * 180
			: "";

		return (
			<div className="Sidebar">
				<div>
					<Palette/>
					<input type="text" onChange={e => this.setRotation(e.target.value)} value={rotation}/>
				</div>
			</div>
		);
	}

	setRotation(value: string) {
		const angle = Number.parseInt(value) / 180 * Math.PI;
		const object = globalState.selected
			? globalState.getObject(globalState.selected)
			: null;
		
		if (object) {
			globalState.setRotation(object.uuid, angle);
		}
	}
}
