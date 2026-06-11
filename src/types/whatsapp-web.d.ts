declare module 'whatsapp-web.js' {
  export class Client {
    constructor(options?: any);
    initialize(): Promise<void>;
    on(event: string, callback: (...args: any[]) => void): void;
    sendMessage(chatId: string, content: string, options?: any): Promise<any>;
    destroy(): Promise<void>;
    getState(): Promise<any>;
    logout(): Promise<void>;
  }

  export class LocalAuth {
    constructor(options?: any);
  }
}
