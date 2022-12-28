import create from "zustand";

export const useExpandedDirectories = create<{
	expanded: Record<string, boolean>;
	setExpanded: (key: string, expanded: boolean) => any;
	resetExpanded: () => any;
}>((set) => ({
	expanded: {
		root: true,
	},
	setExpanded: (key, expanded) =>
		set((state) => ({ expanded: { ...state.expanded, [key]: expanded } })),
	resetExpanded: () => set({ expanded: { root: true } }),
}));

export default useExpandedDirectories;
