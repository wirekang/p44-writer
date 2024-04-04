export type Io = {
  read<T>(collection: string, id: string | number, def?: T): Promise<T>;

  readAll<T>(collection: string): Promise<T[]>;

  write<T>(
    collection: string,
    id: string | number,
    value: T,
    exists: boolean,
  ): Promise<void>;

  delete(collection: string, id: string | number): Promise<void>;
};
