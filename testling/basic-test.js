const { Git, init, add, commit } = require('../dist/bundle.umd.min.js')
const test = require('tape')
const BrowserFS = require('browserfs')

test('things do not explode', t => {
  t.plan(5)
  BrowserFS.install(window)
  BrowserFS.configure({ fs: 'InMemory' }, async function (err) {
    if (err) return t.fail(err)
    var fs = window.require('fs')
    t.ok(fs, 'Loaded fs')

    let repo = new Git({ fs: fs, dir: '.' })
    await init(repo)
    t.pass('init')

    fs.writeFileSync('a.txt', 'Hello', 'utf8')
    await add(repo, { filepath: 'a.txt' })
    t.pass('add a.txt')

    let oid = await commit(repo, {
      author: {
        name: 'Mr. Test',
        email: 'mrtest@example.com',
        timestamp: 1262356920
      },
      message: 'Initial commit'
    })
    t.pass('commit')

    t.equal(
      oid,
      'fbe80a5f33d7876603767211bd6d53d3e308894e',
      "- oid is 'fbe80a5f33d7876603767211bd6d53d3e308894e'"
    )
  })
})
