const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const Reply = require('../../Domains/replies/entities/Reply');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply) {
    const { commentId, content, owner } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();
    const isDelete = false;

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, commentId, owner, content, date, isDelete],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async deleteReply(id) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) throw new NotFoundError('balasan tidak ditemukan');
  }

  async verifyReplyOwner(id, owner) {
    const query = {
      text: 'SELECT owner FROM replies WHERE is_delete = \'false\' AND id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) throw new NotFoundError('balasan tidak ditemukan');

    const reply = result.rows[0];
    if (reply.owner !== owner) throw new AuthorizationError('anda tidak memiliki akses');
  }

  async getRepliesByThreadId(threadId) {
    const query = {
      text: `SELECT replies.id, replies.comment_id, replies.date, replies.content, replies.is_delete, users.username 
          FROM replies
          LEFT JOIN users ON users.id = replies.owner 
          LEFT JOIN comments ON comments.id = replies.comment_id 
          WHERE comments.thread_id = $1 ORDER BY replies.date ASC`,
      values: [threadId],
    };

    const results = await this._pool.query(query);

    return results.rows.map((result) => new Reply({ ...result }));
  }
}

module.exports = ReplyRepositoryPostgres;
