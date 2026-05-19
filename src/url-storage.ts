import type { StateStorage } from "zustand/middleware";

/**
 * Defines where state should be stored in the URL.
 */
export enum UrlStorageProperty {
	/** Uses query string (?key=value) */
	QueryString = "search",
	/** Uses hash (#key=value) */
	Hash = "hash",
}

/**
 * Reads URLSearchParams from either `search` or `hash`.
 * @param locationProperty Where params are stored in the URL.
 */
const getParams = (locationProperty: UrlStorageProperty) => {
	const property = globalThis.location[locationProperty].slice(1);
	const params = new URLSearchParams(property);
	return params;
};

/**
 * Writes URLSearchParams back to the browser URL.
 * @param locationProperty Where params are stored in the URL.
 * @param params The parameters to serialize into the URL.
 * @param replace If true, uses `replaceState`, otherwise `pushState`.
 */
const setParams = (
	locationProperty: UrlStorageProperty,
	params: URLSearchParams,
	replace: boolean,
) => {
	const url = new URL(globalThis.location.href);
	const initialParams = getParams(locationProperty);
	if (initialParams.toString() !== params.toString() && !urlStorage.__lock__) {
		url[locationProperty] = params.toString();
		if (replace) {
			globalThis.history.replaceState(null, "", url);
		} else {
			globalThis.history.pushState(null, "", url);
		}
	}
};

/**
 * Options for configuring URL-based Zustand storage.
 */
export type UrlStorageOptions = {
	/** Determines whether state is stored in query string or hash. */
	urlProperty: UrlStorageProperty;
	/** If true, removes Zustand's `{ state, version }` wrapper and stores only the raw state object in the URL. */
	omitVersion?: boolean;
	/** If true, replaces browser history entries instead of pushing new ones. */
	replace?: boolean;
};

type UrlStorage = StateStorage;

/**
 * Creates a Zustand-compatible storage adapter that persists state in the URL.
 * @param options Options for configuring URL-based Zustand storage.
 */
export const urlStorage = (options?: UrlStorageOptions): UrlStorage => {
	const {
		urlProperty = UrlStorageProperty.QueryString,
		omitVersion = false,
		replace = false,
	} = options || {};

	return {
		/**
		 * Reads a value from the URL by key.
		 */
		getItem: (name: string) => {
			const params = getParams(urlProperty);
			const stored = params.get(name);
			if (stored) {
				try {
					const data = JSON.parse(stored);
					if (omitVersion) {
						return JSON.stringify({ state: data, version: 0 });
					}
				} catch {
					// NOOP - ignore invalid JSON
				}
			}
			return stored;
		},

		/**
		 * Writes a value into the URL under a given key.
		 */
		setItem: (name: string, value: string) => {
			const params = getParams(urlProperty);
			let v = value;
			try {
				const store = JSON.parse(value);
				if (omitVersion && "state" in store) v = JSON.stringify(store.state);
			} catch {
				// NOOP - ignore invalid JSON
			}
			params.set(name, v);
			setParams(urlProperty, params, replace);
		},

		/**
		 * Removes a key from the URL.
		 */
		removeItem: (name: string) => {
			const params = getParams(urlProperty);
			params.delete(name);
			setParams(urlProperty, params, replace);
		},
	};
};
urlStorage.__lock__ = false;

type Store = { persist: { rehydrate: () => void } };

/**
 * Rehydrates one or more Zustand stores when browser navigation occurs.
 *
 * Useful for syncing state when users press back/forward buttons.
 *
 * @param stores Array of Zustand stores using persist middleware
 * @returns cleanup function to remove event listener
 */
urlStorage.rehydrateOnPopState = (stores: Store[]) => {
	const handler = () => {
		urlStorage.__lock__ = true;
		for (const store of stores) {
			console.log(store);
			store.persist.rehydrate();
		}
		urlStorage.__lock__ = false;
	};
	globalThis.addEventListener("popstate", handler);
	return () => {
		globalThis.removeEventListener("popstate", handler);
	};
};
