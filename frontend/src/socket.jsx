// socket.js
import { io } from "socket.io-client";

const socket = io(`${process.env.REACT_APP_API_URL}`); // adjust your server URL/port

export default socket;
