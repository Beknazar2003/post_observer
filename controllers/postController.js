const db = require('../db')

const regex = new RegExp(/[ !+/*-]/)//regular expression for validation table name

//function for create table in db
const create = async (tableName, options) => {
    const sql = []
    for (let key in options) {
      sql.push(`"${key}" ${options[key].split(', ').map(name => name.toUpperCase()).join(' ')}`)
    }
  await db.query(`CREATE TABLE IF NOT EXISTS "${tableName}" (${sql})`)
}
//function for add post to table
const add = async (tableName, options) => {
    const sql = [[],[],[]]
    for (let key in options) {
      sql[0].push(`"${key}"`)
      sql[1].push('$' + sql[0].length)
      sql[2].push(options[key])
    }
  await db.query(`INSERT INTO "${tableName}" (${sql[0]}) VALUES (${sql[1]})`, sql[2])
}
//function for delete post from table
const deletePost = async (tableName, id) => {
  await db.query(`DELETE FROM ${tableName} WHERE id = $1`, [id])
}

//class for control post table
class postController {
  async createPost(req, res, next){
    try{
      const {name} = req.params
      const body = req.body
      if(name !== name.toLowerCase() || regex.test(name)) {
        return res.json('Название таблицы должно быть в нижнем регистре и не должно содержать символы пробела и * - .')
      }
      if(body['id'] === undefined){
        body.id = 'serial, primary key'
      }
      await create(name, body)
      res.json('Ваша таблица успесншно создана.')
    } catch (e){
      res.json('Что-то пошло не так. Перепроверьте данные.')
    }
  }
  async addPost(req, res, next){
    try{
      const {name} = req.params
      const body = req.body
      if(name !== name.toLowerCase()) {
        return res.json('Название таблицы должно быть в нижнем регистре.')
      }
      await add(name, body)
      res.json('Ваш пост успесншно создан.')
    } catch (e){
      res.json('Что-то пошло не так. Перепроверьте данные.')
    }
  }
  async getPosts(req, res, next){
    try {
      const {name} = req.params
      const {limit, page} = req.query
      const {rows} = limit && page ? await db.query(`SELECT * FROM "${name}" LIMIT ${limit} OFFSET ${(page - 1) * limit}`) : await db.query(`SELECT * FROM "${name}" LIMIT 1000`)
      res.json(rows)
    } catch (e) {
      res.json('Что-то пошло не так. Перепроверьте данные.')
    }

  }
  async deletePost(req, res, next){
    try{
      const {name} = req.params
      const {id} = req.query
      deletePost(name, id)
      res.json('Пост успешно удалён')
    }catch (e) {
      res.json('Что то пошло не так')
    }
  }
}

module.exports = new postController()