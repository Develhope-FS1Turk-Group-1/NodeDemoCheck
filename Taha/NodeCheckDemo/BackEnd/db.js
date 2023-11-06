const pgp = require('pg-promise')();
const connectionString = 'postgres://pzuokagf:U14IvGT9SV7YKLSVlnblU60eUMpPV2LL@suleiman.db.elephantsql.com/pzuokagf';
const db = pgp(connectionString);

module.exports = db;
