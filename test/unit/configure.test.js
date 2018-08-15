/**
 * 
 */

const assert = require('assert');
const Client = require('../../lib/client');

const user = process.env['COCKDBUSER'];
const database = process.env['COCKDBDATABASE'];
const host = process.env['COCKDBHOST'];
const port = process.env['COCKDBPORT'];

describe('test from client setting', () => {
    it('should default config equal with env value', () => {
        const client = new Client();
        assert.equal(client.user, user);
        assert.equal(client.database, database);
        assert.equal(client.host, host);
        assert.equal(client.port, port);
    });

    it('test ssl default on', () => {
        const old = process.env.COCKDBSSLMODE
        process.env.COCKDBSSLMODE = 'prefer'

        const client = new Client()
        process.env.COCKDBSSLMODE = old
        assert.equal(client.ssl, true)
    });

    it('test ssl force off', () => {
        const old = process.env.COCKDBSSLMODE
        process.env.COCKDBSSLMODE = 'prefer'

        const client = new Client({
            ssl: false
        })
        process.env.COCKDBSSLMODE = old

        assert.equal(client.ssl, false)
    })
});

describe('test from config string', () => {
    it('use connectionString property', () => {
        const client = new Client({
            connectionString: 'postgresql://root:123456@localhost:26257/bank'
        })

        assert.equal(client.user, 'root');
        assert.equal(client.host, 'localhost');
        assert.equal(client.port, '26257');
        assert.equal(client.database, 'bank');
        assert.equal(client.password, '123456');
    });

    it('use string', () => {
        const client = new Client('postgresql://root:123456@localhost:26257/bank');

        assert.equal(client.user, 'root');
        assert.equal(client.host, 'localhost');
        assert.equal(client.port, '26257');
        assert.equal(client.database, 'bank');
        assert.equal(client.password, '123456');
    });

    it('when config string is not adjective', () => {
        const client = new Client('postgresql://localhost:26257');

        assert.equal(client.user, 'root');
        assert.equal(client.host, 'localhost');
        assert.equal(client.port, '26257');
        assert.equal(client.database, 'bank');
        assert.equal(client.password, null);
    });

});
