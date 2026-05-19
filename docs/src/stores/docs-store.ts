import { UrlStorageProperty } from "@bebokland/zustand-url-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type DocsOptionsStoreState = {
	urlProperty: UrlStorageProperty;
	omitVersion: boolean;
	replace: boolean;
};

export const useDocsOptionsStore = create<DocsOptionsStoreState>()(
	persist(
		(_) => ({
			urlProperty: UrlStorageProperty.QueryString,
			omitVersion: false,
			replace: false,
		}),
		{
			name: "docs-options-store",
		},
	),
);

export const INITIAL_DOCS_STORE_STATE = useDocsOptionsStore.getState();
