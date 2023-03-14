declare module '*.svg' {
    const content: any;
    export default content;
}

// lowdb.d.ts
// declare module 'lowdb/node' {
//     // export function JSONFile<T>(path: string): void
//     export declare class JSONFile<T> implements Adapter<T> {
//         #private;
//         constructor(filename: string);
//         read(): Promise<T | null>;
//         write(obj: T): Promise<void>;
//     }

//     export interface Adapter<T> {
//         read: () => Promise<T | null>;
//         write: (data: T) => Promise<void>;
//     }

//     export declare class Low<T = unknown> {
//         adapter: Adapter<T>;
//         data: T | null;
//         constructor(adapter: Adapter<T>);
//         read(): Promise<void>;
//         write(): Promise<void>;
//     }
// }