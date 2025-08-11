const express = require('express');
const pool = require('./config/dbConnection');
const app = express();

app.use(express.json()); 
pool.connect()
  .then(client => {
    console.log('✅ Connected to PostgreSQL successfully');
    client.release(); 
  })
  .catch(err => {
    console.error('❌ Database connection error:', err.stack);
  });
app.post('/footballers', async (req, res) => {
  try {
    const { name, goals, nickname } = req.body;
    const result = await pool.query(
      'INSERT INTO football (name, goals, nickname) VALUES ($1, $2, $3) RETURNING *',
      [name, goals, nickname]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/footballers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM football ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/footballers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM football WHERE id = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.put('/footballers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, goals, nickname } = req.body;

    const result = await pool.query(
      `UPDATE football
       SET name = COALESCE($1, name),
           goals = COALESCE($2, goals),
           nickname = COALESCE($3, nickname)
       WHERE id = $4
       RETURNING *`,
      [name, goals, nickname, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


app.delete('/footballers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.send('User deleted');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
