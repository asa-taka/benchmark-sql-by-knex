const Knex = require('knex')
const knexfile = require('../knexfile')
const config = knexfile[process.env.NODE_ENV || 'postgresql']
const knex = Knex(config)

const stats = require('stats-lite')

const time = async promise => {
  const start = Date.now()
  await promise
  return Date.now() - start
}

const run = async (task, params, n) => {
  const results = []
  for (let i = 0; i < n; i++) {
    const ms = await time(task(params))
    results.push(ms)
  }
  console.log(`params: ` + JSON.stringify(params))
  console.log(`result> mean: ${stats.mean(results)}, sd: ${stats.stdev(results)}`)
}

const runner = (task, params, paramValues, n) => {
  if (!paramValues.length) {
    run(task, params, n)
    return
  }
  const param = paramValues.pop()
  for (const v of param.values) {
    runner(task, {...params, [param.key]: v }, [...paramValues], n)
  }
}

const randomId = () => Math.floor(Math.random() * 1000000)

const findByIds = ({ table }) => {
  const ids = Array(1000).fill().map(randomId)
  return knex(table).whereIn("id", ids)
}

const paramValues = [
  { key: 'table', values: ['users', 'users__indexed'] },
]

runner(findByIds, {}, paramValues, 1000)