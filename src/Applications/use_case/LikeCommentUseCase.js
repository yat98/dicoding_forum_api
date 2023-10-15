const LikeComment = require('../../Domains/userCommentLikes/entities/LikeComment');

class LikeCommentUseCase {
  constructor({
    threadRepository,
    commentRepository,
    userCommentLikeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._userCommentLikeRepository = userCommentLikeRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, owner } = new LikeComment(useCasePayload);
    await this._threadRepository.verifyThreadExists(threadId);
    await this._commentRepository.verifyCommentExists(commentId);
    const likeExists = await this._userCommentLikeRepository.verifyLikeExists(commentId, owner);
    if (likeExists) {
      await this._userCommentLikeRepository.deleteLike(commentId, owner);
      return;
    }

    await this._userCommentLikeRepository.addLike(commentId, owner);
  }
}

module.exports = LikeCommentUseCase;
