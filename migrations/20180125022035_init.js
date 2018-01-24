
exports.up = async function(knex, Promise) {
  await knex.schema.createTable('users', function(table) {
    prepareTable(table)
  })
  await knex.schema.createTable('users__indexed', function(table) {
    prepareTable(table)
    table.index('id')
  })
}

function prepareTable(table) {
  table.integer('id').unsigned().primary()
  table.string('name').notNullable()
  table.integer('age').unsigned().notNullable()
  table.timestamps(true, true)
}

exports.down = async function(knex, Promise) {
  await knex.schema.dropTableIfExists('users')
  await knex.schema.dropTableIfExists('users__indexed')
}
