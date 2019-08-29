import * as React from "react";
import { observer } from "mobx-react";
import { observable, computed } from "mobx";
import gql from "graphql-tag";

import { Interval } from "../util/Interval";
import globalState from "../../store";

import "./CandleStickChart.scss";

interface CandleProps {
	low: number;
	high: number;
	open: number;
	close: number;

	scalingFactor: number;
	centerLine: number;
}

class Candle extends React.Component<CandleProps> {
	render() {
		return (
			<div className={`CandleColumn ${this.props.open <= this.props.close ? "bullish" : "bearish"}`}>
				<div>
					<div className="wick" style={this.wickStyle}></div>
					<div className="body" style={this.bodyStyle}></div>
				</div>
			</div>
		);
	}

	private get wickHeight(): number {
		return Math.abs(
			this.priceToCoordinate(this.props.high)
			- this.priceToCoordinate(this.props.low)
		);
	}

	private get bodyHeight(): number {
		return Math.abs(
			this.priceToCoordinate(this.props.open)
			- this.priceToCoordinate(this.props.close)
		);
	}

	private get wickStyle(): any {
		return {
			height: `${this.wickHeight}px`,
			top:  `${-Math.max(this.priceToCoordinate(this.props.high), this.priceToCoordinate(this.props.low))}px`,
		};
	}

	private get bodyStyle(): any {
		return {
			height: `${this.bodyHeight}px`,
			top:  `${-Math.max(this.priceToCoordinate(this.props.open), this.priceToCoordinate(this.props.close))}px`,
		};
	}

	private priceToCoordinate(price: number): number {
		const reference = this.props.centerLine;
		const factor = this.props.scalingFactor;
		return (price - reference) * factor;
	}
}

@observer
export class CandleStickChart extends React.Component {
	@observable private candles: Pick<CandleProps, "low" | "high" | "open" | "close">[] = [
		{
			low: 10.5,
			open: 11,
			close: 18,
			high: 12,
		},
		{
			low: 10,
			open: 12,
			close: 11,
			high: 12,
		},
		{
			low: 8,
			open: 9,
			close: 12,
			high: 15,
		},
	];

	private async updateChart() {
		const result = await globalState.client.query<{asset: { candles: Pick<CandleProps, "low" | "high" | "open" | "close">[] }}>({
			query: gql`
			query CandleQuery {
				asset {
					candles {
						low, high, open, close
					}
				}
			}
			`,
			fetchPolicy: "network-only"
		});

		this.candles = result.data.asset.candles;
	}

	@computed private get range(): [number, number] {
		let lowest: number = 0;
		let highest: number = 0;
		
		for (let candle of this.candles) {
			if (candle.low < lowest) lowest = candle.low;
			if (candle.high > highest) highest = candle.high;
		}

		return [lowest, highest];
	}

	@computed private get baseline(): number {
		const [high, low] = this.range;
		return (high + low) / 2;
	}

	@computed private get scale(): number {
		const [high, low] = this.range;
		return 300 / ((high - low) / 2);
	}

	render() {
		return (
			<div className="CandleStickChart">
				<Interval interval={1000} callback={this.updateChart.bind(this)}/>
				{this.candles.map((props, i) => <Candle {...props} key={i} centerLine={this.baseline} scalingFactor={this.scale}/>)}
			</div>
		);
	}
}
