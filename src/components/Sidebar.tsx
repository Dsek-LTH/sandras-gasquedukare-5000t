import * as React from "react";
import { observer } from "mobx-react";
import * as uuid from "uuid";

import "./Sidebar.scss";
import { Palette } from "./Palette";

@observer
export class Sidebar extends React.Component {
	render() {
		return (
			<div className="Sidebar">
				<div>
					<Palette/>
				</div>
			</div>
		);
	}
}
