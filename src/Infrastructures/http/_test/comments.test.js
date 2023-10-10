const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");

describe('/threads/{threadId}/comments endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const threadRequestPayload = {
        title: 'Lorem',
        body: 'Lorem ipsum site dolor',
      };
      const commentRequestPayload = {
        content: 'Lorem ipsum site dolor',
      };
      const server = await createServer(container);
      // add user
      let response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      // login & get token
      response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });
      const accessToken = response.result.data.accessToken;
      // add thread
      response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadRequestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const threadId = response.result.data.addedThread.id;

      // Action
      response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: commentRequestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.content).toBeDefined();
      expect(responseJson.data.addedComment.owner).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const threadRequestPayload = {
        title: 'Lorem',
        body: 'Lorem ipsum site dolor',
      };
      const commentRequestPayload = {
      };
      const server = await createServer(container);
      // add user
      let response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      // login & get token
      response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });
      const accessToken = response.result.data.accessToken;
      // add thread
      response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadRequestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const threadId = response.result.data.addedThread.id;

      // Action
      response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: commentRequestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat komen baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const threadRequestPayload = {
        title: 'Lorem',
        body: 'Lorem ipsum site dolor',
      };
      const commentRequestPayload = {
        content: ['lorem ipsum'],
      };
      const server = await createServer(container);
      // add user
      let response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      // login & get token
      response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });
      const accessToken = response.result.data.accessToken;
      // add thread
      response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: threadRequestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const threadId = response.result.data.addedThread.id;

      // Action
      response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          threadId,
          ...commentRequestPayload,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat komen baru karena tipe data tidak sesuai');
    });

    it('should response 404 when thread not exists', async () => {
      // Arrange
      const requestPayload = {
        username: 'dicoding',
        password: 'secret',
      };
      const commentRequestPayload = {
        content: 'Lorem ipsum site dolor',
      };
      const server = await createServer(container);
      // add user
      let response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      // login & get token
      response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: requestPayload,
      });
      const accessToken = response.result.data.accessToken;

      // Action
      response = await server.inject({
        method: 'POST',
        url: `/threads/xxxx/comments`,
        payload: commentRequestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
  });
});