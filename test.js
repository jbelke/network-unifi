const nock = require('nock');
const unifi = require('.');

const options = {
  url: 'https://172.16.0.10:8443',
  username: 'admin',
  password: 'password',
  site: 'default',
};

test('default options', async () => {
  const scope = nock('https://192.168.0.1:8443')
    .post('/api/login', {
      username: '',
      password: '',
    })
    .reply(
      201,
      {},
      {
        'set-cookie': 'test',
      },
    );

  await unifi();

  expect(scope.isDone()).toBe(true);
});

test('needs all options', async () => {
  const scope = nock('https://172.16.0.10:8443')
    .post('/api/login', {
      username: 'admin',
      password: 'password',
    })
    .reply(
      201,
      {},
      {
        'set-cookie': 'test',
      },
    );

  await unifi(options);
  expect(scope.isDone()).toBe(true);
});

test('sets ssl agent on ignoreSsl option', async () => {
  const scope = nock('https://172.16.0.10:8443')
    .post('/api/login', {
      username: 'admin',
      password: 'password',
    })
    .reply(
      201,
      {},
      {
        'set-cookie': 'test',
      },
    );

  const optionsSsl = {
    ...options,
    ignoreSsl: true,
  };

  await unifi(optionsSsl);

  expect(scope.isDone()).toBe(true);
});

test('fails if no cookie is returned from login', async () => {
  nock('https://172.16.0.10:8443')
    .post('/api/login', {
      username: 'admin',
      password: 'password',
    })
    .reply(201, {});

  expect(unifi(options)).rejects.toThrowError('Invalid Login Cookie');
});

test('api #get', async () => {
  const scope = nock('https://172.16.0.10:8443')
    .post('/api/login', {
      username: 'admin',
      password: 'password',
    })
    .reply(
      201,
      {},
      {
        'set-cookie': 'test',
      },
    );

  const router = await unifi(options);
  expect(scope.isDone()).toBe(true);

  const scopeAccess = nock('https://172.16.0.10:8443')
    .get('/api/s/default/')
    .reply(201, { data: { test: 'test' } });

  const data = await router.get();

  expect(data).toEqual({ test: 'test' });
  expect(scopeAccess.isDone()).toBe(true);
});

test('api #getAccessPoints', async () => {
  const scope = nock('https://172.16.0.10:8443')
    .post('/api/login', {
      username: 'admin',
      password: 'password',
    })
    .reply(
      201,
      {},
      {
        'set-cookie': 'test',
      },
    );

  const router = await unifi(options);
  expect(scope.isDone()).toBe(true);

  const scopeAccess = nock('https://172.16.0.10:8443')
    .get('/api/s/default/stat/device')
    .reply(201, { data: { test: 'test' } });

  const data = await router.getAccessPoints();

  expect(data).toEqual({ test: 'test' });
  expect(scopeAccess.isDone()).toBe(true);
});

test('api #getClients', async () => {
  const scope = nock('https://172.16.0.10:8443')
    .post('/api/login', {
      username: 'admin',
      password: 'password',
    })
    .reply(
      201,
      {},
      {
        'set-cookie': 'test',
      },
    );

  const router = await unifi(options);
  expect(scope.isDone()).toBe(true);

  const scopeAccess = nock('https://172.16.0.10:8443')
    .get('/api/s/default/stat/sta')
    .reply(201, { data: { test: 'test' } });

  const data = await router.getClients();

  expect(data).toEqual({ test: 'test' });
  expect(scopeAccess.isDone()).toBe(true);
});
