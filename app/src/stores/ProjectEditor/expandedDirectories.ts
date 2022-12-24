import create from "zustand";

export const useExpandedDirectories = create<{
	expanded: Record<string, boolean>;
	setExpanded: (key: string, expanded: boolean) => any;
}>((set) => ({
	expanded: {
		root: true,
	},
	setExpanded: (key, expanded) =>
		set((state) => ({ expanded: { ...state.expanded, [key]: expanded } })),
}));

export default useExpandedDirectories;
