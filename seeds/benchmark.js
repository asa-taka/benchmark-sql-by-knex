
exports.seed = async function(knex, Promise) {
  await prepareRecords(knex('users'))
  await prepareRecords(knex('users__indexed'))
}

// Register 100,000,000 records
const prepareRecords = async table => {
  await table.del()
  for (let i = 0; i < 10000; i++) {
    const users = seq(10000, i * 10000).map(createUser)
    await table.insert(users)
  }
}

const createUser = id => ({ id, name: `user-${id}`, age: id % 100 })

const seq = (n, offset) => {
  return Array(1000).fill(0).map((_, i) => i + offset)
}