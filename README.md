<h1 align="center">Forum API</h1>

<p align="center">
<img src="https://github.com/yat98/dicoding_forum_api/actions/workflows/ci.yml/badge.svg" />
<img src="https://github.com/yat98/dicoding_forum_api/actions/workflows/cd.yml/badge.svg" />
<img src="https://codecov.io/gh/yat98/dicoding_forum_api/graph/badge.svg?token=6WHTWNBNVE" />
</p>
<h2>Description</h2>
<p>
 This is last project submission for <a href="https://www.dicoding.com/academies/276">Dicoding class</a>  using backend Hapi JS, Jest for testing and eslint for linter. It has authentication, threads, comments, replies feature. build using clean architecture + TDD.
<p>

<h3>Instalation</h3>

- Install modules

```bash
$ npm install
```

- Copy .env.example to .env

```bash
$ cp .env.example .env
```

<h3>Running App</h3>

```bash
$ npm start

or

# development
$ npm run start:dev
```

<h3>Test</h3>

```bash
# Test
$ npm test

# Test Watch
$ npm run test:watch

# Test Coverage
$ npm run test:coverage
```