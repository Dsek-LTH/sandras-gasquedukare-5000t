import * as React from "react";
import { observer } from "mobx-react";
import * as uuid from "uuid";

import "./Sidebar.scss";
import { Palette } from "./Palette";
import globalState from "../store";
import { observable } from "mobx";
import { ObjectModel, meters } from "../model/ObjectModel";


// färger som varje namn/grupp borde ha kopplad till sig
const colors = [
	'#e6194b',
	'#3cb44b',
	'#ffe119',
	'#4363d8',
	'#f58231',
	'#911eb4',
	'#46f0f0',
	'#f032e6',
	'#bcf60c',
	'#fabebe',
	'#008080',
	'#e6beff',
	'#9a6324',
	'#fffac8',
	'#800000',
	'#aaffc3',
	'#808000',
	'#ffd8b1',
	'#000075',
	'#808080'
]

@observer
export class Sidebar extends React.Component {
	@observable sittersInput: string;
	@observable sitGroups: any;

	render() {
		const rotation = globalState.selected
			? globalState.getObject(globalState.selected).rotation / Math.PI * 180
			: "";

		return (
			<div className="Sidebar">
				<div>
					<Palette />
					<input type="number" onChange={e => this.setRotation(e.target.value || "0")} value={rotation} />
					<form onSubmit={this.importSitters}>
						{/* Dennat textarea kräver att man pastar i format: namn[tab]grupp[newline] osv. ctrl+v från sheets */}
						<textarea cols={30} rows={30} onChange={e => this.sittersInput = e.target.value}></textarea>
						<button disabled={!this.sittersInput} type="submit"> skicka in grejor </button>
					</form>
					{Object.keys(this.sitGroups || {}).map((name, index) => <div key={name} style={{ color: colors[index] }}>{name} </div>)}
				</div>
			</div >
		);
	}

	importSitters = (e: any) => {
		e.preventDefault()

		// saknar typ, hur typar man unknown mängd keys som alla har samma värdestyp?
		this.sitGroups = this.sittersInput
			.split("\n")
			.map(p => p.split("\t"))
			.reduce((acc: any, [name, group]) => ({ ...acc, [group]: acc[group] ? [...acc[group], name] : [name] }), {})

		const times: any = (func: any, n: number) => new Array(n).fill(0).forEach((n, index) => func(index))

		// Borde vara en metod som heter create object group
		Object.entries(this.sitGroups).forEach(([groupName, nameList], x_index) => {
			const groupUuid = uuid.v4();
			times((n: number) => globalState.createObject({
				position: {
					x: 80 + n * (meters(ObjectModel.DEFAULT_WIDTH)),
					y: 50 + x_index * (meters(ObjectModel.DEFAULT_DEPTH) + meters(0.5)),
				},
				groupUuid: groupUuid,
			}), Math.ceil(nameList.length / 6))
			// Här kallar vi populate tables eller dylikt för att fylla borden
			// ex: populate(groupUuid, groupName, nameList)
		})

		// killer features: delete table och se till att människorna inte försvinner i farten
		// flytande mellanplats där man kan drag and droppa folk som inte sitter någonstanns? pool typ
		// också: man behöver kunna se namnen såklart
		// senare: se till att det får plats i gasque
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
