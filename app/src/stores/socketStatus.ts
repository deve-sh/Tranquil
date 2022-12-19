import create from "zustand/vanilla";
import createHook from "zustand";

export const socketStatus = create<{
	connected: boolean;
	setConnected: (conn: boolean) => any;
}>((set) => ({
	connected: false,
	setConnected: (connected: boolean) => set({ connected }),
}));

const useSocketStatus = createHook(socketStatus);

export default useSocketStatus;
