'use strict'

const got = require('got')
const https = require('https')
const { parse } = require('url')

const defaults = {
  username: '',
  password: '',
  port: 8443,
  url: 'https://192.168.0.1',
  site: 'default',
  ignoreSsl: false
}

function unifi (config = {}) {
  const {
    username,
    password,
    port,
    url,
    site,
    ignoreSsl
  } = Object.assign({}, defaults, config)
  const baseUrl = `${url}:${port}`
  const { hostname } = parse(baseUrl)

  let agent

  const loginOptions = {
    method: 'POST',
    body: JSON.stringify({
      username,
      password
    })
  }

  if (ignoreSsl) {
    agent = new https.Agent({
      host: hostname,
      port,
      path: '/',
      rejectUnauthorized: false
    })
    loginOptions.agent = agent
  }

  const getSessionCookie = () => got(`${baseUrl}/api/login`, loginOptions).then(result => {
    const cookie = result.headers['set-cookie']
    if (!cookie) throw new Error('Invalid Login Cookie')
    return cookie
  })

  return getSessionCookie().then(cookie => {
    const options = {
      headers: { cookie },
      json: true
    }

    if (ignoreSsl) {
      options.agent = agent
    }

    const get = (url = '') =>
      got(`${baseUrl}/api/s/${site}/${url}`, options).then(result => result.body.data)

    return {
      getAccessPoints: () => get('stat/device'),
      getClients: () => get('stat/sta'),
      get
    }
  })
}

module.exports = unifi
