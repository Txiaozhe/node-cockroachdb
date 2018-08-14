
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
            client.query('INSERT INTO accounts (id, balance) VALUES (6, 1000);', (err, res) => {
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
