/* eslint-disable class-methods-use-this */
class Reply {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.username = payload.username;
    this.date = payload.date;
    this.content = payload.is_delete === 'true' ? '**balasan telah dihapus**' : payload.content;
    this.commentId = payload.comment_id;
  }

  _verifyPayload(payload) {
    const {
      id, username, date, content, is_delete: isDelete, comment_id: commentId,
    } = payload;

    if (!id || !username || !date || !content || !isDelete || !commentId) {
      throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof username !== 'string'
      || typeof date !== 'string'
      || typeof content !== 'string'
      || typeof isDelete !== 'string'
      || typeof commentId !== 'string'
    ) {
      throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Reply;
