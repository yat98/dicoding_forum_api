const DeleteReply = require('../../Domains/replies/entities/DeleteReply');

/* eslint-disable class-methods-use-this */
class DeleteReplyUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const {
      threadId, commentId, replyId, owner,
    } = new DeleteReply(useCasePayload);
    await this._replyRepository.verifyReplyOwner(replyId, owner);
    await this._commentRepository.verifyCommentExists(commentId);
    await this._threadRepository.verifyThreadExists(threadId);
    await this._replyRepository.deleteReply(replyId);
  }
}

module.exports = DeleteReplyUseCase;
