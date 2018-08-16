/**
 * 
 */
const cockdb = require('../../');

const config = {
    user: 'root',
    host: 'localhost',
    database: 'bank',
    port: 26257
};

const pool = new cockdb.Pool(config);

async function runTrans() {
    let client;
    try {
        client = await pool.connect();
        await client.query('BEGIN; SAVEPOINT cockroach_restart');

        console.log('begin');
        const b1 = await client.query('SELECT id, balance FROM accounts WHERE id = $1', [1]);
        console.log('begin: ', b1.rows);

        await client.query('UPDATE accounts SET balance = balance - $1 WHERE id = $2', [100, 1]);
        const b2 = await client.query('SELECT id, balance FROM accounts WHERE id = $1', [1]);
        console.log('step1: ', b2.rows);

        // test error
        throw new Error('test error');
        await client.query('UPDATE accounts SET balance = balance + $1 WHERE id = $2', [200, 1]);

        const b3 = await client.query('SELECT id, balance FROM accounts WHERE id = $1', [1]);
        console.log('after: ', b3.rows);

        await commit(client);
    } catch (err) {
        console.log(err);
        await rollback(client);

        const b4 = await client.query('SELECT id, balance FROM accounts WHERE id = $1', [1]);
        console.log('after error: ', b4.rows);
    }

    await releaseSavepoint(client);
}

async function rollback(client) {
    if (!client) {
        return;
    }
    await client.query('ROLLBACK TO SAVEPOINT cockroach_restart');
}

async function commit(client) {
    await client.query('COMMIT');
}

async function releaseSavepoint(client) {
    await client.query('RELEASE SAVEPOINT cockroach_restart');
}

async function rollbackToSavePoint(client) {
    await client.query('ROLLBACK TO SAVEPOINT cockroach_restart');
}

runTrans()
