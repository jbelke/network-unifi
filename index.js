const fetch = require('cross-fetch');
const https = require('https');

const defaults = {
  username: '',
  password: '',
  url: 'https://192.168.0.1:8443',
  site: 'default',
  ignoreSsl: false,
};

async function unifi(config = {}) {
  const options = {
    ...defaults,
    ...config,
  };

  const agent = options.ignoreSsl
    ? new https.Agent({
        rejectUnauthorized: false,
      })
    : null;

  const result = await fetch(`${options.url}/api/login`, {
    method: 'POST',
    body: JSON.stringify({
      username: options.username,
      password: options.password,
    }),
    agent,
  });

  const cookie = result.headers.get('set-cookie');

  if (!cookie) throw new Error('Invalid Login Cookie');

  const get = async (url = '') => {
    const response = await fetch(
      `${options.url}/api/s/${options.site}/${url}`,
      {
        headers: { cookie },
        agent,
      },
    );
    const { data } = await response.json();
    return data;
  };

  return {
    getAccessPoints: async () => get('stat/device'),
    getClients: async () => get('stat/sta'),
    get,
  };
}

module.exports = unifi;
