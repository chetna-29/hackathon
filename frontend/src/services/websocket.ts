type EventHandler = (data: any) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private handlers: Map<string, EventHandler[]> = new Map();
  private reconnectTimer: any = null;
  public isConnected: boolean = false;
  private onConnectionChange: (status: boolean) => void = () => {};

  public url: string;

  constructor(url: string) {
    this.url = url;
  }

  public connect() {
    if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)) {
      return;
    }

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.isConnected = true;
      this.onConnectionChange(true);
      if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    };

    this.ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        const { event: eventType, data } = payload;
        
        const eventHandlers = this.handlers.get(eventType) || [];
        eventHandlers.forEach(handler => handler(data));
      } catch (e) {
        console.error("Failed to parse WS message", e);
      }
    };

    this.ws.onclose = () => {
      this.isConnected = false;
      this.onConnectionChange(false);
      this.reconnect();
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.ws?.close();
    };
  }

  public setConnectionHandler(handler: (status: boolean) => void) {
    this.onConnectionChange = handler;
  }

  private reconnect() {
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, 3000);
  }

  public on(event: string, handler: EventHandler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)?.push(handler);
  }

  public off(event: string, handler: EventHandler) {
    const eventHandlers = this.handlers.get(event);
    if (eventHandlers) {
      this.handlers.set(event, eventHandlers.filter(h => h !== handler));
    }
  }

  public disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsService = new WebSocketService('ws://localhost:8000/api/v1/ws/');
