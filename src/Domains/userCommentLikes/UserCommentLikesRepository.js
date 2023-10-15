/* eslint-disable require-await */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
class UserCommentLikesRepository {
  async addLike(commentId, owner) {
    throw new Error('USER_COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyLikeExists(commentId, owner) {
    throw new Error('USER_COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteLike(commentId, owner) {
    throw new Error('USER_COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = UserCommentLikesRepository;
