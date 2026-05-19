import { UrlStorageProperty, urlStorage } from "@bebokland/zustand-url-storage";
import { concat, without } from "lodash";
import { type ChangeEvent, useCallback, useEffect, useState } from "react";
import { shallow } from "zustand/shallow";
import { BebokBar } from "./components/bebok-bar";
import { EXAMPLE_CODE } from "./example";
import { useBebokStore } from "./stores/bebok-store";
import {
	INITIAL_DOCS_STORE_STATE,
	useDocsOptionsStore,
} from "./stores/docs-store";

import "./App.css";
import { Beboks } from "./components/beboks";
import { COLORS, GITHUB_URL } from "./constants";

function App() {
	const [changed, setChanged] = useState<boolean>(false);

	const urlProperty = useDocsOptionsStore((state) => state.urlProperty);
	const omitVersion = useDocsOptionsStore((state) => state.omitVersion);
	const replace = useDocsOptionsStore((state) => state.replace);

	useEffect(() => urlStorage.rehydrateOnPopState([useBebokStore]), []);

	const { amount, setAmount, colors, setColors, special, setSpecial } =
		useBebokStore();

	const onOptionsChange = useCallback((ev: ChangeEvent<HTMLInputElement>) => {
		switch (ev.target.name) {
			case "history":
				useDocsOptionsStore.setState({
					replace: ev.target.value === "replace",
				});
				break;
			case "property":
				useDocsOptionsStore.setState({
					urlProperty:
						ev.target.value === "query string"
							? UrlStorageProperty.QueryString
							: ev.target.value === "hash"
								? UrlStorageProperty.Hash
								: UrlStorageProperty.QueryString,
				});
				break;
			case "omit-version":
				useDocsOptionsStore.setState({
					omitVersion: ev.target.checked,
				});
				break;
		}
	}, []);

	useEffect(() => {
		const unsubscribe = useDocsOptionsStore.subscribe((state) => {
			const changed = !shallow(state, INITIAL_DOCS_STORE_STATE);
			setChanged(changed);
		});

		return () => {
			unsubscribe();
		};
	}, []);

	const reload = () => {
		useBebokStore.setState({ amount: 10, special: undefined, colors: [] });
		window.history.replaceState({}, document.title, window.location.pathname);
		window.location.reload();
	};

	return (
		<div className="app-container">
			<section>
				<h1>@bebokland/zustand-url-storage</h1>

				<p>
					<span className="mono">@bebokland/zustand-url-storage</span> is a
					custom storage adapter for Zustand's persist middleware that stores
					state directly in the browser URL (query string or hash). It
					implements the
					<span className="mono">StateStorage</span> interface, allowing Zustand
					stores to seamlessly read from and write to URL parameters instead of
					traditional storage like <span className="mono">localStorage</span>.
				</p>
				<h2>What it does</h2>
				<ul>
					<li>
						Persists Zustand state in the browser URL (query string or hash)
					</li>
					<li>Hydrates state from the URL on load</li>
					<li>Keeps store state and URL in sync automatically</li>
					<li>
						Supports both <span className="mono">pushState</span> and{" "}
						<span className="mono">replaceState</span> history updates
					</li>
					<li>
						Provides optional handling for Zustand's{" "}
						<span className="mono">{"{state, version}"}</span> wrapper
					</li>
					<li>
						Enables rehydration on browser navigation (
						<span className="mono">popstate</span>)
					</li>
				</ul>
				<h2>Usage example</h2>
				<code>
					<pre>{EXAMPLE_CODE.replaceAll("\t", "  ")}</pre>
				</code>
			</section>
			<section>
				<h1>Playground</h1>
				<div className="playground-container">
					<BebokBar />

					<div className="playground">
						<div className="store-vis">
							<div className="store-data">
								<h4>Store data:</h4>
								<code>
									<pre>{JSON.stringify(useBebokStore.getState(), null, 2)}</pre>
								</code>
							</div>

							<div className="store-interactive">
								<h4>Interactive store visualization:</h4>
								<div className="color-btns">
									{COLORS.map((c) => (
										<button
											className="color-btn"
											key={c.angle}
											type="button"
											style={{
												filter: `contrast(40%) sepia(${colors.includes(c.name) ? "1" : "0.01"}) hue-rotate(${c.angle}deg) saturate(1000%)`,
											}}
											onClick={() => {
												if (colors.includes(c.name)) {
													setColors(without(colors, c.name));
												} else {
													setColors(concat(colors, c.name));
												}
											}}
										>
											{c.name}
										</button>
									))}
								</div>

								<label>
									<input
										type="range"
										min={1}
										max={10}
										step={1}
										value={amount}
										name="amount"
										onChange={(ev) => {
											const amount = Number(ev.target.value);
											setAmount(amount);
										}}
									/>{" "}
									amount: <span className="mono">{amount}</span>
								</label>

								<ul className="beboks">
									<Beboks
										amount={amount}
										colors={colors}
										special={special}
										onElementClick={(i) => setSpecial(i)}
									/>
								</ul>
							</div>
						</div>
						<div>
							<h2
								style={{
									display: "flex",
									alignItems: "center",
								}}
							>
								<span className="mono">urlStorage</span> Options
								{changed ? (
									<span className="changed-indicator">
										changed{" "}
										<button type="button" onClick={reload}>
											reload
										</button>
									</span>
								) : null}
							</h2>

							<div className="store-options">
								<code>
									<pre>
										{JSON.stringify(
											{ urlProperty, omitVersion, replace },
											null,
											4,
										)}
									</pre>
								</code>
								<div>
									<div>
										<h4>History</h4>
										<label>
											<input
												type="radio"
												name="history"
												value="push"
												checked={!replace}
												onChange={onOptionsChange}
											/>{" "}
											push history
										</label>
										<label>
											<input
												type="radio"
												name="history"
												value="replace"
												checked={replace}
												onChange={onOptionsChange}
											/>{" "}
											replace history
										</label>
									</div>

									<div>
										<h4>Property</h4>
										<label>
											<input
												type="radio"
												name="property"
												value="query string"
												checked={urlProperty === UrlStorageProperty.QueryString}
												onChange={onOptionsChange}
											/>{" "}
											query string
										</label>
										<label>
											<input
												type="radio"
												name="property"
												value="hash"
												checked={urlProperty === UrlStorageProperty.Hash}
												onChange={onOptionsChange}
											/>{" "}
											hash
										</label>
									</div>

									<div>
										<h4>Other</h4>
										<label>
											<input
												type="checkbox"
												name="omit-version"
												onChange={onOptionsChange}
												checked={omitVersion}
											/>{" "}
											omit version
										</label>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			<footer>
				<a href={GITHUB_URL}>GitHub</a>{" "}
				<span>&copy; {new Date().getFullYear()} Artur Siaznik</span>{" "}
				<span>ISC License</span>
			</footer>
			<div className="lic">
				Permission to use, copy, modify, and/or distribute this software for any
				purpose with or without fee is hereby granted, provided that the above
				copyright notice and this permission notice appear in all copies. THE
				SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
				WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
				MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
				ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
				WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
				ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
				OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
			</div>
		</div>
	);
}

export default App;
