const { Pool } = require('pg');

const pool = new Pool({
  user: 'Mohammedsameers',        
  host: 'localhost',
  database: 'demodatabase',     
  password: 'Thunder@10',
  port: 5432,             
});

module.exports = pool;
