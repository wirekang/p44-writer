import { contextBridge } from "electron";
import { Io } from "./io/io";
import { MemoryIo } from "./io/memory-io";

const memoryIo = new MemoryIo();
const io: Io = {
  read: memoryIo.read.bind(memoryIo),
  write: memoryIo.write.bind(memoryIo),
  delete: memoryIo.delete.bind(memoryIo),
  readAll: memoryIo.readAll.bind(memoryIo),
};

contextBridge.exposeInMainWorld("io", io);
