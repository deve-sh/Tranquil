import create from "zustand";

export interface ToastState {
	message: string | null;
	type: "success" | "error" | "info";
	show: boolean;
	setToast: (args: Partial<ToastState>) => void;
}

const useToastStore = create<ToastState>((set) => ({
	message: null,
	show: false,
	type: "info",
	setToast: ({ message, show = true, type }: Partial<ToastState>) =>
		set({ message, show, type }),
}));

export default useToastStore;
