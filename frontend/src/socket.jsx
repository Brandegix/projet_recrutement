// socket.js
import { io } from "socket.io-client";

const socket = io("https://projet-recrutement.onrender.com", {
  withCredentials: true, // allows cookies and session headers to be sent
  transports: ["websocket", "polling"], // ensures fallback
});

export default socket;
