const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const Comment = require("../../../Domains/comments/entities/Comment");
const NewComment = require("../../../Domains/comments/entities/NewComment");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");

describe('CommentRepositoryPostgres', () => { 
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new thread and return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' });
      const newComment = new NewComment({
        threadId: 'thread-123',
        content: 'Lorem ipsum sit dolor',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addComment(newComment);

      // Assert
      const thread = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(thread).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' });

      const newComment = new NewComment({
        threadId: 'thread-123',
        content: 'Lorem ipsum sit dolor',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await threadRepositoryPostgres.addComment(newComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: newComment.content,
        owner: newComment.owner,
      }));
    });
  });

  describe('deleteComment function', () => {
    it('should throw NotFoundError when comment not exists', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      
      // Action & Assert
      await expect(commentRepositoryPostgres.deleteComment('comment-123'))
        .rejects
        .toThrowError(NotFoundError);
      const thread = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(thread[0]).toBeUndefined();
    });

    it('should delete comment using soft delete', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' });
      await CommentsTableTestHelper.addComment({ content: 'ipsum' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteComment('comment-123');

      // Assert
      const thread = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(thread).toHaveLength(1);
      expect(thread[0].is_delete).toBe("true");
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should not throw error when comment owned by user owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' });
      await CommentsTableTestHelper.addComment({ content: 'Lorem' });
      const threadRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyCommentOwner('comment-123','user-123'))
        .resolves
        .not.toThrow();
    });

    it('should throw NotFoundError when comment not exists', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' });
      await CommentsTableTestHelper.addComment({ content: 'Lorem' });
      const threadRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyCommentOwner('comment-999','user-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when not owned by user', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' });
      await CommentsTableTestHelper.addComment({ content: 'Lorem' });
      const threadRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyCommentOwner('comment-123','user-999'))
        .rejects
        .toThrowError(AuthorizationError);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return empty comments', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const commentRepository = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      // Assert
      expect(commentRepository).toEqual([]);
    });

    it('should return comments correctly', async () => {
      // Arrange
      const date = new Date().toISOString();
      await UsersTableTestHelper.addUser({ username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ title: 'Lorem' });
      await CommentsTableTestHelper.addComment({ content: 'lorem', date })
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const commentRepository = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      // Assert
      expect(commentRepository.length).toBe(1);
      expect(commentRepository[0]).toEqual(new Comment({
        id: 'comment-123',
        content: 'lorem',
        date,
        username: 'dicoding',
        is_delete: 'false',
      }));
    });
  });
});