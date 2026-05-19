<p align="center">
  <img src="docs/public/zustand-url-storage.svg" />
</p>

# @bebokland/zustand-url-storage

`@bebokland/zustand-url-storage` is a custom storage adapter for Zustand's persist middleware that stores state directly in the browser URL (query string or hash).
It implements the `StateStorage` interface, allowing Zustand stores to seamlessly read from and write to URL parameters instead of traditional storage like `localStorage`.


## What it does

- Persists Zustand state in the browser URL (query string or hash)
- Hydrates state from the URL on load
- Keeps store state and URL in sync automatically
- Supports both `pushState` and `replaceState` history updates
- Provides optional handling for Zustand’s `{ state, version }` wrapper
- Enables rehydration on browser navigation (`popstate`)


## Key features

- Works as a drop-in storage for Zustand persist
- No external storage required (no localStorage, no backend)
- Makes state:
  - shareable via URL
  - bookmarkable
  - easy to debug

## Installation

<details>
    <summary>npm</summary>

```bash
npm install @bebokland/zustand-url-storage
```
</details>

<details>
    <summary>pnpm</summary>

```bash
pnpm add @bebokland/zustand-url-storage
```
</details>

<details>
    <summary>yarn</summary>

```bash
yarn add @bebokland/zustand-url-storage
```
</details>

## Example

```typescript
import {
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
            merge: mergePersistedState<BebokStoreState & BebokStoreActions>(INITIAL_STATE) // optional shallow merge with fallback to initial
        },
    ),
);

useEffect(() => urlStorage.rehydrateOnPopState([useBebokStore]), []);
```