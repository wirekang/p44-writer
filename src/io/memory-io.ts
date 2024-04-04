import { Io } from "./io";

export class MemoryIo implements Io {
  private data: Record<string, Record<string, any>> = {
    value: {
      languages: ["en", "ko"],
    },
  };

  async read<T>(
    collection: string,
    id: string | number,
    def?: T | undefined,
  ): Promise<T> {
    this.log("read", `${collection}/${id}`, def);
    const col = this.data[collection];
    if (col === undefined) {
      if (def !== undefined) {
        return def;
      }
      throw new Error(`not found: ${collection}/${id}`);
    }
    const v = col[id];
    if (v === undefined) {
      if (def !== undefined) {
        return def;
      }
      throw new Error(`not found: ${collection}/${id}`);
    }
    return v;
  }

  async readAll<T>(collection: string): Promise<T[]> {
    this.log("readAll", collection);
    const c = this.data[collection];
    if (c === undefined) {
      return [];
    }
    return Object.values(c);
  }

  async write<T>(
    collection: string,
    id: string | number,
    value: T,
    exists: boolean,
  ): Promise<void> {
    this.log("write", `${collection}/${id}`, value, exists);
    let c = this.data[collection];
    if (c === undefined) {
      c = {};
      this.data[collection] = c;
    }
    const has = Object.keys(c).includes(`${id}`);
    if (exists !== has) {
      throw new Error(`${c}/${id} has:${has} exists: ${exists}`);
    }
    c[id] = value;
  }

  async delete(collection: string, id: string | number): Promise<void> {
    this.log("delete", `${collection}/${id}`);
    let c = this.data[collection];
    if (c === undefined) {
      c = {};
      this.data[collection] = c;
    }
    delete c[id];
  }

  private log(...args: any[]) {
    console.log("[IO]", ...args);
  }
}