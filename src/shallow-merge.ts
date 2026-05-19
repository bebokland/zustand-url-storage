/**
 * Creates a shallow state merge function that combines the current state
 * with a persisted state value or a provided initial fallback.
 *
 * The returned function prioritizes values from `persisted` (when available),
 * otherwise it falls back to `initial`, while preserving properties from
 * `currentState`.
 *
 * @template S - The shape of the state object.
 * @param initial - Optional fallback state used when no persisted state exists.
 * @returns A merge function that combines persisted and current state values.
 */
export const mergePersistedState =
	<S extends object>(initial?: Partial<S>) =>
	/**
	 * Performs a shallow merge between the current state and persisted state.
	 *
	 * @param persisted - The persisted state value to merge into the current state.
	 * @param currentState - The current in-memory state.
	 * @returns A new state object containing merged values.
	 */
	(persisted: unknown, currentState: S) => {
		const source =
			persisted &&
			typeof persisted === "object" &&
			Object.keys(persisted).length > 0
				? persisted
				: initial;

		return {
			...currentState,
			...source,
		};
	};
