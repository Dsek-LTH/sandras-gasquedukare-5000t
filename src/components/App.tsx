import * as React from "react";

import { Sidebar } from "./Sidebar";

import "./App.scss";
import { Floor } from "./Floor";

export class App extends React.Component {
	render() {
		return (
			<div className="App">
				<Floor/>
				<Sidebar/>
			</div>
		);
	}
}
