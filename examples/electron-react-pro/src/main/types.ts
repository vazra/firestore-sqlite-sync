import { v4 } from "uuid";

export {};
declare global {
  interface Window {
    getServerSocket: () => Promise<string>;
    ipcConnect: any;
    IS_DEV: boolean;
    uuid: typeof v4;
  }
}
