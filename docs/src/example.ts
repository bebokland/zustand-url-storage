export const EXAMPLE_CODE = `import {
    type UrlStorageOptions,
    UrlStorageProperty,
    urlStorage,
    mergePersistedState,
} from "@bebokland/zustand-url-storage";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// ...

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

const INITIAL_STATE: BebokStoreState = {
    amount: 50,
    special: undefined,
    colors: [],
};

const useBebokStore = create<BebokStoreState & BebokStoreActions>()(
    persist(
        (set) => ({
            ...INITIAL_STATE,
            setAmount: (amount) => set({ amount }),
            setSpecial: (idx) => set({ special: idx }),
            setColors: (colors) => set({ colors: uniq(colors) }),
        }),
        {
            name: "bebok-store",
            storage: createJSONStorage(() =>
                urlStorage({
                    urlProperty: UrlStorageProperty.QueryString,
                    omitVersion: true,
                    replace: false,
                }),
            ),
            merge: mergePersistedState<BebokStoreState & BebokStoreActions>(INITIAL_STATE)
        },
    ),
);

useEffect(() => urlStorage.rehydrateOnPopState([useBebokStore]), []);
`;
