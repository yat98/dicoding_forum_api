class NewReply {
  constructor(payload) {
    this._verifyPayload(payload);

    this.commentId = payload.commentId;
    this.content = payload.content;
    this.owner = payload.owner;
  }

  _verifyPayload(payload) {
    const { commentId, content, owner } = payload;

    if (!commentId || !content || !owner) {
      throw new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = NewReply;
