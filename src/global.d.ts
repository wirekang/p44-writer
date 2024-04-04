import { P44Api } from "./api/p44-api";
import { Io } from "./io/io.js";

declare global {
  interface Window {
    io: Io;
  }
}

export {};
