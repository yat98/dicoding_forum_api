/* eslint-disable class-methods-use-this */
class LikeComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { threadId, commentId, owner } = payload;

    this.threadId = threadId;
    this.commentId = commentId;
    this.owner = owner;
  }

  _verifyPayload({ threadId, commentId, owner }) {
    if (!commentId || !threadId || !owner) {
      throw new Error('LIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof commentId !== 'string' || typeof threadId !== 'string' || typeof owner !== 'string') {
      throw new Error('LIKE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = LikeComment;
