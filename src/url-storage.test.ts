import { beforeEach, describe, expect, test, vi } from "vitest";
import { UrlStorageProperty, urlStorage } from "./url-storage";

function mockUrl(url: string) {
	const u = new URL(url);

	Object.defineProperty(globalThis, "location", {
		value: {
			href: u.toString(),
			search: u.search,
			hash: u.hash,
			pathname: u.pathname,
			origin: u.origin,
		},
		writable: true,
	});

	Object.defineProperty(globalThis, "history", {
		value: {
			pushState: vi.fn(),
			replaceState: vi.fn(),
		},
		writable: true,
	});
}

describe("urlStorage", () => {
	beforeEach(() => {
		mockUrl("http://example.com?bebok=12&bear=polar#bebok=34&bear=brown");
	});

	test("creates url storage adapter", () => {
		const adapter = urlStorage();
		expect(adapter).not.toBe(undefined);
		expect(adapter).toHaveProperty("getItem");
		expect(adapter).toHaveProperty("setItem");
		expect(adapter).toHaveProperty("removeItem");
	});

	test("gets item from URL's query string", () => {
		const adapter = urlStorage({
			urlProperty: UrlStorageProperty.QueryString,
		});

		expect(adapter.getItem("bebok")).toBe("12");
		expect(adapter.getItem("bear")).toBe("polar");
	});

	test("gets item from URL's hash", () => {
		const adapter = urlStorage({
			urlProperty: UrlStorageProperty.Hash,
		});

		expect(adapter.getItem("bebok")).toBe("34");
		expect(adapter.getItem("bear")).toBe("brown");
	});

	test("sets item to URL's query string and pushes history", () => {
		const adapter = urlStorage({
			urlProperty: UrlStorageProperty.QueryString,
		});

		adapter.setItem("bebok", "00");

		expect(globalThis.history.replaceState).toHaveBeenCalledTimes(0);
		expect(globalThis.history.pushState).toHaveBeenCalledTimes(1);
		expect(globalThis.history.pushState).toHaveBeenCalledWith(
			null,
			"",
			new URL("http://example.com?bebok=00&bear=polar#bebok=34&bear=brown"),
		);
	});

	test("sets item to URL's query string and replaces history", () => {
		const adapter = urlStorage({
			urlProperty: UrlStorageProperty.QueryString,
			replace: true,
		});

		adapter.setItem("bebok", "00");

		expect(globalThis.history.replaceState).toHaveBeenCalledTimes(1);
		expect(globalThis.history.pushState).toHaveBeenCalledTimes(0);
		expect(globalThis.history.replaceState).toHaveBeenCalledWith(
			null,
			"",
			new URL("http://example.com?bebok=00&bear=polar#bebok=34&bear=brown"),
		);
	});

	test("sets item to URL's hash and pushes history", () => {
		const adapter = urlStorage({
			urlProperty: UrlStorageProperty.Hash,
		});

		adapter.setItem("bebok", "00");

		expect(globalThis.history.replaceState).toHaveBeenCalledTimes(0);
		expect(globalThis.history.pushState).toHaveBeenCalledTimes(1);
		expect(globalThis.history.pushState).toHaveBeenCalledWith(
			null,
			"",
			new URL("http://example.com?bebok=12&bear=polar#bebok=00&bear=brown"),
		);
	});

	test("sets item to URL's hash and replaces history", () => {
		const adapter = urlStorage({
			urlProperty: UrlStorageProperty.Hash,
			replace: true,
		});

		adapter.setItem("bebok", "00");

		expect(globalThis.history.replaceState).toHaveBeenCalledTimes(1);
		expect(globalThis.history.pushState).toHaveBeenCalledTimes(0);
		expect(globalThis.history.replaceState).toHaveBeenCalledWith(
			null,
			"",
			new URL("http://example.com?bebok=12&bear=polar#bebok=00&bear=brown"),
		);
	});

	test("removes item from URL's query string", () => {
		const adapter = urlStorage({
			urlProperty: UrlStorageProperty.QueryString,
		});

		adapter.removeItem("bebok");

		expect(globalThis.history.pushState).toHaveBeenCalledTimes(1);
		expect(globalThis.history.pushState).toHaveBeenCalledWith(
			null,
			"",
			new URL("http://example.com?bear=polar#bebok=34&bear=brown"),
		);
	});

	test("removes item from URL's hash", () => {
		const adapter = urlStorage({
			urlProperty: UrlStorageProperty.Hash,
		});

		adapter.removeItem("bebok");

		expect(globalThis.history.pushState).toHaveBeenCalledTimes(1);
		expect(globalThis.history.pushState).toHaveBeenCalledWith(
			null,
			"",
			new URL("http://example.com?bebok=12&bear=polar#bear=brown"),
		);
	});
});
