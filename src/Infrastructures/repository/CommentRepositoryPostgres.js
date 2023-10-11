const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const Comment = require('../../Domains/comments/entities/Comment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { threadId, content, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const isDelete = false;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, threadId, owner, content, date, isDelete],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async deleteComment(id) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) throw new NotFoundError('komen tidak ditemukan');
  }

  async verifyCommentOwner(id, owner) {
    const query = {
      text: 'SELECT owner FROM comments WHERE is_delete = \'false\' AND id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) throw new NotFoundError('komen tidak ditemukan');

    const comment = result.rows[0];
    if (comment.owner !== owner) throw new AuthorizationError('anda tidak memiliki akses');
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id, comments.date, comments.content, comments.is_delete, users.username 
          FROM comments
          LEFT JOIN users ON comments.owner = users.id 
          WHERE comments.thread_id = $1 ORDER BY comments.date ASC`,
      values: [threadId],
    };

    const results = await this._pool.query(query);

    return results.rows.map((result) => new Comment({ ...result }));
  }

  async verifyCommentExists(id) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) throw new NotFoundError('komen tidak ditemukan');
  }
}

module.exports = CommentRepositoryPostgres;
