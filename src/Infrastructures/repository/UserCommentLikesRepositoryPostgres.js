const InvariantError = require('../../Commons/exceptions/InvariantError');
const UserCommentLikesRepository = require('../../Domains/userCommentLikes/UserCommentLikesRepository');

class UserCommentLikesRepositoryPostgres extends UserCommentLikesRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(commentId, owner) {
    const id = `like-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO user_comment_likes VALUES($1, $2, $3)',
      values: [id, commentId, owner],
    };

    await this._pool.query(query);
  }

  async verifyLikeExists(commentId, owner) {
    const query = {
      text: 'SELECT id FROM user_comment_likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);

    return Boolean(result.rowCount);
  }

  async deleteLike(commentId, owner) {
    const query = {
      text: 'DELETE FROM user_comment_likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) throw new InvariantError('komentar yang disukai tidak ditemukan');
  }
}

module.exports = UserCommentLikesRepositoryPostgres;
