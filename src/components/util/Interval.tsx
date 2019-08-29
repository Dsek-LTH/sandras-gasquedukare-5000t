import * as React from "react";

export interface IntervalProps {
	interval: number;
	callback: () => void;
}

export class Interval extends React.Component<IntervalProps> {
	private intervalHandle: any;

	componentDidMount() {
		this.intervalHandle = setInterval(this.props.callback, this.props.interval);
		console.log("Created interval.");
	}

	componentWillUnmount() {
		clearInterval(this.intervalHandle);
		console.log("Cleared interval.");
	}
	
	render(): JSX.Element {
		return null;
	}
}
