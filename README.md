# cockroachdb

<!-- [![Build Status](https://secure.travis-ci.org/brianc/node-postgres.svg?branch=master)](http://travis-ci.org/brianc/node-postgres)
[![Dependency Status](https://david-dm.org/brianc/node-postgres.svg)](https://david-dm.org/brianc/node-postgres) -->
<span class="badge-npmversion"><a href="https://github.com/Txiaozhe/cockroachdb" title="View this project on GitHub"><img src="https://img.shields.io/github/stars/Txiaozhe/cockroachdb.svg" alt="GitHub stars" /></a></span>
<span class="badge-npmdownloads"><a href="https://github.com/Txiaozhe/cockroachdb" title="View this project on GitHub"><img src="https://img.shields.io/github/license/Txiaozhe/cockroachdb.svg" alt="license" /></a></span>

Non-blocking CockroachDB client for Node.js. Forked from brianc/node-postgres.  Pure JavaScript and optional native libpq bindings.

## Install

```sh
$ npm install cockroachdb --save
```

## Getting Started

### Basic
```javascript
// Require the driver.
const cockdb = require('cockroachdb');

// Connect to the "bank" database.
const config = {
    user: 'root',
    host: 'localhost',
    database: 'bank',
    port: 26257
};

// Create a pool.
const pool = new cockdb.Pool(config);

pool.connect(function (err, client, done) {
    if (err) {
        console.log(err);
        // Closes communication with the database when error.
        done();
    } else {
        if (err) {
            console.error('could not connect to cockroachdb', err);
            done();
        } else {
            // Create the "accounts" table.
            client.query('CREATE TABLE IF NOT EXISTS accounts (id INT PRIMARY KEY, balance INT);', (err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(res);
                }
            });

            // Insert rows into the "accounts" table.
            client.query('INSERT INTO accounts (id, balance) VALUES (5, 1000);', (err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(res);
                }
            });

            // Print out the balances.
            client.query('SELECT id, balance FROM accounts;', (err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(res.rows);
                }
            });
        }

        // Close communication with the database when finish your operate
    }
})
```

### Transaction
```javascript
const cockdb = require('cockroachdb');

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

runTrans();
```

## License

Copyright (c) 2018 Txiaozhe (txiaozhe@gmail.com)

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
