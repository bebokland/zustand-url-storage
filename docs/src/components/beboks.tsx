import { nth } from "lodash";
import bebokHead from "../assets/bebok-head.svg";
import { COLORS } from "../constants";

import "./beboks.css";

type BeboksProps = {
	amount: number;
	colors: string[];
	special: number | undefined;
	onElementClick: (idx: number) => void;
};

const makeColorFilter = (color: (typeof COLORS)[number]) =>
	`contrast(40%) sepia(1) hue-rotate(${color.angle}deg) saturate(1000%)`;

export const Beboks = ({
	amount,
	colors,
	special,
	onElementClick,
}: BeboksProps) => {
	return Array(amount)
		.fill(null)
		.map((_, i) => {
			const color = COLORS.find(
				(c) => c.name === nth(colors, i % colors.length),
			);
			const elementKey = `${i}/${amount}`;

			return (
				<li key={elementKey}>
					<button
						type="button"
						onClick={() => {
							onElementClick(i);
						}}
					>
						<img
							src={bebokHead}
							alt="bebok"
							width={24}
							style={{
								filter: color ? makeColorFilter(color) : undefined,
								animationName: special === i ? "rotate" : undefined,
							}}
						/>
					</button>
				</li>
			);
		});
};
