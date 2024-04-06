import { METHODS } from "./api/p44-api";
import { mapIpcInvoke } from "./utils/ipc-bridge";

mapIpcInvoke("p44Api", METHODS);

mapIpcInvoke("value", ["prod"]);
