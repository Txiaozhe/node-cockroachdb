/**
 * test connect
 */
const cockdb = require('../../');

const config = {
    user: 'root',
    host: 'localhost',
    database: 'bank',
    port: 26257
};

describe('test connect with callback', () => {
    it('callback should finish without error', done => {
        const pool = new cockdb.Pool(config);
        pool.connect(function (err, client, fin) {
            if (err) {
                done(err);
            } else {
                client.query('SELECT id, balance FROM accounts;', (err, res) => {
                    if (err) {
                        done(err);
                    } else {
                        console.log(res.rows);
                        fin();
                        done();
                    }
                });
            }
        })
    });
});

describe('test connect with promise', () => {
    it('promise should finish without error', () => {
        const pool = new cockdb.Pool(config);
        return pool.connect().then((client) => {
            return client.query('SELECT id, balance FROM accounts;');
        }).catch((err) => {
            
        });
    });
});
