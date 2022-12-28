import create from "zustand";

export const useOpenedFiles = create<{
	opened: Record<string, boolean>;
	setOpened: (key: string, opened: boolean) => any;
	resetOpened: () => any;
}>((set) => ({
	opened: {},
	setOpened: (key, opened) =>
		set((state) => ({ opened: { ...state.opened, [key]: opened } })),
	resetOpened: () => set({ opened: {} }),
}));

export default useOpenedFiles;
