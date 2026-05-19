import { describe, expect, test } from "vitest";
import { mergePersistedState } from "./shallow-merge";

describe("mergePersistedState", () => {
	test("returns current state when persisted is undefined", () => {
		const merge = mergePersistedState();

		expect(merge(undefined, { a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
	});

	test("applies persisted values over current state", () => {
		const merge = mergePersistedState();

		expect(merge({ a: 2, c: 3 }, { a: 1, b: 2 })).toEqual({
			a: 2,
			b: 2,
			c: 3,
		});
	});

	test("applies initial values when persisted is undefined", () => {
		const merge = mergePersistedState({ a: 0, b: 0 });

		expect(merge(undefined, { a: 1, b: 2 })).toEqual({
			a: 0,
			b: 0,
		});
	});

	test("persisted values override initial values", () => {
		const merge = mergePersistedState({ a: 0, b: 0 });

		expect(merge({ a: 5 }, { a: 1, b: 2 })).toEqual({
			a: 5,
			b: 2,
		});
	});

	test("falls back to initial when persisted is empty", () => {
		const merge = mergePersistedState({ a: 0, b: 0 });

		expect(merge({}, { a: 1, b: 2 })).toEqual({
			a: 0,
			b: 0,
		});
	});

	test("uses persisted when persisted has values", () => {
		const merge = mergePersistedState({ a: 0, b: 0 });

		expect(merge({ a: 5 }, { a: 1, b: 2 })).toEqual({
			a: 5,
			b: 2,
		});
	});

	test("falls back to current state when neither persisted nor initial exist", () => {
		const merge = mergePersistedState();

		expect(merge(undefined, { a: 1, b: 2 })).toEqual({
			a: 1,
			b: 2,
		});
	});

	test("does not mutate inputs", () => {
		const merge = mergePersistedState();

		const persisted = { a: 2 };
		const current = { a: 1, b: 2 };

		const result = merge(persisted, current);

		expect(result).not.toBe(current);
		expect(result).not.toBe(persisted);

		expect(current).toEqual({ a: 1, b: 2 });
		expect(persisted).toEqual({ a: 2 });
	});

	test("performs only a shallow merge", () => {
		const merge = mergePersistedState();

		expect(
			merge(
				{
					nested: { a: 2 },
				},
				{
					nested: { a: 1, b: 2 },
				},
			),
		).toEqual({
			nested: { a: 2 },
		});
	});
});
