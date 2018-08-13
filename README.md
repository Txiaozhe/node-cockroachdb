# node-postgres

[![Build Status](https://secure.travis-ci.org/brianc/node-postgres.svg?branch=master)](http://travis-ci.org/brianc/node-postgres)
[![Dependency Status](https://david-dm.org/brianc/node-postgres.svg)](https://david-dm.org/brianc/node-postgres)
<span class="badge-npmversion"><a href="https://npmjs.org/package/pg" title="View this project on NPM"><img src="https://img.shields.io/npm/v/pg.svg" alt="NPM version" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/pg" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/pg.svg" alt="NPM downloads" /></a></span>

Non-blocking CockroachDB client for Node.js. forked from brianc/node-postgres.  Pure JavaScript and optional native libpq bindings.

## Install

```sh
$ npm install cockroachdb --save
```

## Getting Started

```javascript
// Require the driver.
const cockdb = require('../../');

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
