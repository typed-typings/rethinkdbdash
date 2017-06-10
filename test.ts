/// <reference path="bundle.d.ts" />

import assert = require('assert');
import rethinkdbdash = require('rethinkdbdash');

(async function () {
  const options: rethinkdbdash.ConnectOptions = {
    db: `test${Math.random().toString(36).substr(2)}`,
    host: 'localhost'
  };

  const r = rethinkdbdash(options);

  try {
    const dbCreateResult = await r.dbCreate(options.db).run();

    assert.equal(dbCreateResult.dbs_created, 1);

    const tableCreateResult = await r.tableCreate('Test').run();

    assert.equal(tableCreateResult.tables_created, 1);

    assert.deepEqual(await r.tableList().contains('Test').run(), true);

    const insertedNewId = await r.table('Test').insert({ hello: true }).run();

    assert.ok(Array.isArray(insertedNewId.generated_keys));

    const insertedUseId = await r.table('Test').insert({ id: '123' }).run();

    assert.ok(typeof insertedUseId.generated_keys === 'undefined');

    const result = await r.map([1, 2, 3], (v) => v.mul(10)).run();

    assert.deepEqual(result, [10, 20, 30]);

    const tableDropResult = await r.tableDrop('Test').run();

    assert.equal(tableDropResult.tables_dropped, 1);

    const dbDropResult = await r.dbDrop(options.db).run();

    assert.equal(dbDropResult.dbs_dropped, 1);
  } catch (err) {
    console.log(err);

    process.exit(1);
  } finally {
    r.getPoolMaster().drain();
  }
})();
