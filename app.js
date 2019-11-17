#! /usr/local/bin/node

const express = require("express")
const bodyParser = require("body-parser")
const exec = require("child_process").exec

class ServerApp {
  constructor(port = 7654, cwd = process.cwd(), hostname = "localhost", protocol = "http") {
    this._cwd = cwd.replace(/\/$/, "") + "/"
    this._port = port
    this._hostname = hostname
    this._protocol = protocol
    this._files = new Set("baby-names.csv gutenberg.tsv".split(" "))
    this._commands = new Set("headers".split(" "))
  }

  getCwd() {
    return this._cwd
  }

  get app() {
    if (!this._app) this._initApp()
    return this._app
  }

  _handleXsvRequest(req, res) {
    console.log("handling")
    const userCommand = req.query.command
    const userFile = req.query.file
    if (!this._commands.has(userCommand)) return res.status(400).send(`${userCommand} not found.`)
    if (!this._files.has(userFile)) return res.status(400).send(`${userFile} not found.`)
    const command = `xsv ${userCommand} ${userFile}`
    const child = exec(command)
    child.stdout.pipe(res)
  }

  _initApp() {
    const app = express()
    this._app = app
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.cwd = this.getCwd()

    app.get("/get", (req, res) => {
      this._handleXsvRequest(req, res)
    })

    app.get("/", (req, res) => {
      const files = Array.from(this._files)
      const commands = Array.from(this._commands)
      const links = files
        .map(file => {
          return commands
            .map(command => {
              const link = `get?file=${file}&command=${command}`
              return `<a href="${link}">${link}</a>`
            })
            .join("<br>")
        })
        .join("<br>")
      res.send(links)
    })

    return app
  }

  _getUrlBase() {
    return `${this._protocol}://${this._hostname}:${this._port}/`
  }

  start() {
    this.app.listen(this._port, () => {
      console.log(`Running ${this.constructor.name} in folder '${this.getCwd()}'. cmd+dblclick: ${this._getUrlBase()}`)
    })
  }
}

if (!module.parent) {
  const port = process.argv[2]
  const app = new ServerApp(port)
  app.start()
}

module.exports = { ServerApp }
