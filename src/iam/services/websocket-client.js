// websocket-client.js
const WS_URL = import.meta.env.VITE_WS_URL;

export default class WebSocketClient {
    constructor(onMessageCallback) {
        this.socket = null;
        this.onMessageCallback = onMessageCallback; // Guarda la referencia
    }

    connect() {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("Token no encontrado en localStorage.");
            return;
        }

        const url = `${WS_URL}?access_token=${encodeURIComponent(token)}`;
        console.log("🌐 URL WebSocket que estoy usando:", url);

        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            console.log("WebSocket conectado.");
            // Mensaje inicial si quieres
            this.send("Hello from client!");
        };

        this.socket.onmessage = (event) => {
            console.log("Mensaje recibido:", event.data);
            if (this.onMessageCallback) {
                this.onMessageCallback(event.data);
            }
        };

        this.socket.onerror = (error) => {
            console.error("Error en WebSocket:", error);
        };

        this.socket.onclose = (event) => {
            console.log(`WebSocket cerrado. Código: ${event.code}, Razón: ${event.reason}`);
        };
    }

    send(message) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(message);
        } else {
            console.warn("No se puede enviar, el WebSocket no está abierto.");
        }
    }

    close() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
}
