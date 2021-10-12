const {Pool} = require('pg')

module.exports = new Pool({
  host: '192.168.0.250',
  database: 'post_observer',
  user: 'camp',
  password: 'camp20',
  port: 5432,
})