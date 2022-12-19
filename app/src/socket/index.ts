import { io as socketClient } from "socket.io-client";
import { socketStatus } from "../stores/socketStatus";

const socket = socketClient(import.meta.env.BACKEND_URL);

socket.on("connect", () => {
	socketStatus.getState().setConnected(true);
});

socket.on("disconnect", () => {
	socketStatus.getState().setConnected(false);
});

export default socket;
