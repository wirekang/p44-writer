import { mapIpcInvoke } from "./utils/ipc-bridge";

mapIpcInvoke("io", ["read", "readAll", "write", "delete", "dump"]);

mapIpcInvoke("value", ["prod"]);
