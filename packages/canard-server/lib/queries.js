// https://node-postgres.com/api/pool
const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
})

const getQuestions = async () => {
  const questions = await pool.query('select * from questions offset random() * (select count(*) from questions) limit 5');
  return questions.rows;
}

module.exports = {
  getQuestions,
}