const DeleteComment = require('../../Domains/comments/entities/DeleteComment');

/* eslint-disable class-methods-use-this */
class DeleteCommentUseCase {
  constructor({
    threadRepository,
    commentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, owner } = new DeleteComment(useCasePayload);
    await this._commentRepository.verifyCommentOwner(commentId, owner);
    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.deleteComment(commentId);
  }
}

module.exports = DeleteCommentUseCase;
