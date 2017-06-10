import * as Bluebird from 'bluebird';
import { EventEmitter } from 'events';
import { Readable, Transform, Writable } from 'stream';

declare module 'rethinkdb' {


  interface RunOptions {
    /**
     * When true, the driver will not automatically coerce cursor results to an array (default: `false`).
     */
    cursor: boolean;
  }

  namespace r {
    export interface Run<T> {
      /**
       * Run a query and return it as a `Readable` stream.
       */
      toStream(connection?: Connection, type?: { readable: true }): Readable;
      toStream(type?: { readable: true }): Readable;

      /**
       * Create a `Writable` stream for piping data into a table.
       */
      toStream(connection: Connection, type: { writable: true }): Writable;
      toStream(type: { writable: true }): Writable;

      toStream(connection: Connection, type: { transform: true }): Transform;
      toStream(type: { transform: true }): Transform;

      run(options?: RunOptions): Bluebird<T>;
    }
  }
}

import * as RethinkDB from 'rethinkdb';

declare function rethinkdbdash(options?: rethinkdbdash.ConnectOptions): rethinkdbdash.ReqlClient;

declare namespace rethinkdbdash {
  interface PoolMaster extends EventEmitter {
    drain(): void;

    getLength(): number;

    getAvailableLength(): number;
  }

  type Client = typeof RethinkDB;

  interface ReqlClient extends Client {
    getPoolMaster(): PoolMaster;
  }

  interface ConnectOptions extends RethinkDB.ConnectOptions {
    /**
     * The driver will regularly pull data from the table server_status to keep a list of updated hosts (default: `false`).
     */
    discovery?: boolean;

    /**
     * Whether or not a connection pool should be used (default: `true`).
     */
    pool?: boolean;

    /**
     * Minimum number of connections available in the pool (default: `50`).
     */
    buffer?: number;

    /**
     * Maximum number of connections available in the pool (default: `1000`).
     */
    max?: number;

    /**
     * The connection will be pinged every `pingInterval` seconds (default: `-1`).
     */
    pingInterval?: number;

    /**
     * Wait time in milliseconds before reconnecting in case of an error (default: `1000`).
     */
    timeoutError?: number;

    /**
     * Wait time in milliseconds before a connection that hasn't been used is removed from the pool (default: `60  * 60  * 1000`).
     */
    timeoutGb?: number;

    /**
     * The maximum timeout before trying to reconnect is `2^maxExponent  * timeoutError` (default: `6`, aka ~60 seconds).
     */
    maxExponent?: number;

    /**
     * Silence logging to `console.error` (default: `false`).
     */
    silent?: boolean;

    /**
     * An array of hosts representing RethinkDB nodes to connect to.
     */
    servers?: Array<{ host: string, port: number }>;

    /**
     * Whether queries should be run implicitly by calling `.then()` or using `yield` (default: `true`).
     */
    optionalRun?: boolean;

    /**
     * When true, the driver will not automatically coerce cursor results to an array (default: `false`).
     */
    cursor?: boolean;
  }

  // interface Connection extends RethinkDB.Connection { }
  // interface CursorResult<T> extends RethinkDB.CursorResult<T> { }
  // interface ArrayResult<T> extends RethinkDB.ArrayResult<T> { }
}

export = rethinkdbdash;
