const UserCommentLikesRepository = require('../UserCommentLikeRepository');

describe('UserCommentLikesRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const userCommentLikesRepository = new UserCommentLikesRepository();

    // Action and Assert
    await expect(userCommentLikesRepository.addLike('', '')).rejects.toThrowError('USER_COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(userCommentLikesRepository.verifyLikeExists('', '')).rejects.toThrowError('USER_COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(userCommentLikesRepository.deleteLike('', '')).rejects.toThrowError('USER_COMMENT_LIKES_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
