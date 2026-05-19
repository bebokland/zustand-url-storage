import { useEffect, useLayoutEffect, useRef } from "react";
import bebokHands from "../assets/bebok-hands.svg";
import bebokHead from "../assets/bebok-head.svg";
import "./bebok-bar.css";

type BebokBarProps = {
	defaultValue?: string;
};

export const BebokBar = ({ defaultValue }: BebokBarProps) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const bebokHeadRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		const mousemove = (ev: MouseEvent) => {
			if (!bebokHeadRef.current) return;
			const X = ev.clientX;
			const Y = ev.clientY;

			const relativeX = X / window.innerWidth;
			const relativeY = Y / window.innerHeight;

			bebokHeadRef.current.style.transform = `translate(${relativeX * 100 - 100}%, ${-relativeY * 2}%)`;
		};
		window.addEventListener("mousemove", mousemove);
		return () => {
			window.removeEventListener("mousemove", mousemove);
		};
	}, []);

	const queryString = decodeURIComponent(window.location.search);
	const hash = decodeURIComponent(window.location.hash);

	const content = queryString || hash || defaultValue || "...";

	// biome-ignore lint/correctness/useExhaustiveDependencies: highlight on change
	useLayoutEffect(() => {
		containerRef.current?.classList.add("highlight");
		const to = setTimeout(() => {
			containerRef.current?.classList.remove("highlight");
		}, 200);
		return () => {
			clearTimeout(to);
		};
	}, [content]);

	return (
		<div ref={containerRef} className="bebok-bar">
			<img
				ref={bebokHeadRef}
				className="head"
				src={bebokHead}
				alt="bebok-head"
				width="128"
			/>
			<div className="bar">
				<img src={bebokHead} alt="icon" width="16px" />
				<span>{content}</span>
			</div>
			<img className="hands" src={bebokHands} alt="bebok-head" width="128" />
		</div>
	);
};
