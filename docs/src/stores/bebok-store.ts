import {
	mergePersistedState,
	urlStorage,
} from "@bebokland/zustand-url-storage";
import { uniq } from "lodash";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useDocsOptionsStore } from "./docs-store";

type BebokStoreState = {
	amount: number;
	special?: number;
	colors: string[];
};

type BebokStoreActions = {
	setAmount: (amount: number) => void;
	setSpecial: (idx?: number) => void;
	setColors: (colors: string[]) => void;
};

const INITIAL_BEBOK_STORE_STATE: BebokStoreState = {
	amount: 10,
	special: undefined,
	colors: [],
};

export const useBebokStore = create<BebokStoreState & BebokStoreActions>()(
	persist(
		(set) => ({
			...INITIAL_BEBOK_STORE_STATE,
			setAmount: (amount) => set({ amount }),
			setSpecial: (idx) => set({ special: idx }),
			setColors: (colors) => set({ colors: uniq(colors) }),
		}),
		{
			name: "bebok-store",
			storage: createJSONStorage(() =>
				urlStorage({
					urlProperty: useDocsOptionsStore.getState().urlProperty,
					omitVersion: useDocsOptionsStore.getState().omitVersion,
					replace: useDocsOptionsStore.getState().replace,
				}),
			),
			merge: mergePersistedState<BebokStoreState & BebokStoreActions>(
				INITIAL_BEBOK_STORE_STATE,
			),
		},
	),
);
