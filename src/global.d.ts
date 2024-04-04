import { P44Api } from "./p44-api.js";

declare global {
  interface Window {
    p44Api: P44Api;
  }
}

export {};
