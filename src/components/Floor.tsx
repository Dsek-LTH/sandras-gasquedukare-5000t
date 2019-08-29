import * as React from "react";
import { observer } from "mobx-react";

import "./Floor.scss";

export class Floor extends React.Component {
	private ref = React.createRef<HTMLDivElement>();

	render() {
		return (
			<div className="Floor" ref={this.ref}>
			</div>
		);
	}
}
