const Thread = require("./Thread");

class DetailThread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.thread = new Thread(payload.thread);
    this.thread.comments = payload.comments;
  }

  _verifyPayload(payload) {
    const { thread, comments } = payload;

    if (!thread || !comments) {
      throw new Error('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof thread !== 'object' || !Array.isArray(comments)) {
      throw new Error('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DetailThread;