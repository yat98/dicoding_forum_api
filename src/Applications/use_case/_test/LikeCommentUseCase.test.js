const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const UserCommentLikesRepository = require('../../../Domains/userCommentLikes/UserCommentLikeRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');

describe('LikeCommentUseCase', () => {
  it('should orchestrating the add like comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockUserCommentLikesRepository = new UserCommentLikesRepository();
    const mockUserRepository = new UserRepository();

    mockThreadRepository.verifyThreadExists = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = jest.fn(() => Promise.resolve());
    mockUserCommentLikesRepository.verifyLikeExists = jest.fn(() => Promise.resolve(false));
    mockUserCommentLikesRepository.addLike = jest.fn(() => Promise.resolve());
    mockUserCommentLikesRepository.deleteLike = jest.fn(() => Promise.resolve());
    mockUserRepository.verifyUserExists = jest.fn(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      userRepository: mockUserRepository,
      userCommentLikeRepository: mockUserCommentLikesRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith('comment-123');
    expect(mockUserRepository.verifyUserExists).toBeCalledWith('user-123');
    expect(mockUserCommentLikesRepository.verifyLikeExists).toBeCalledWith('comment-123', 'user-123');
    expect(mockUserCommentLikesRepository.addLike).toBeCalledWith('comment-123', 'user-123');
    expect(mockUserCommentLikesRepository.deleteLike).toBeCalledTimes(0);
  });

  it('should orchestrating the delete like comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockUserCommentLikesRepository = new UserCommentLikesRepository();
    const mockUserRepository = new UserRepository();

    mockThreadRepository.verifyThreadExists = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentExists = jest.fn(() => Promise.resolve());
    mockUserCommentLikesRepository.verifyLikeExists = jest.fn(() => Promise.resolve(true));
    mockUserCommentLikesRepository.deleteLike = jest.fn(() => Promise.resolve());
    mockUserCommentLikesRepository.addLike = jest.fn(() => Promise.resolve());
    mockUserRepository.verifyUserExists = jest.fn(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      userRepository: mockUserRepository,
      userCommentLikeRepository: mockUserCommentLikesRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith('comment-123');
    expect(mockUserRepository.verifyUserExists).toBeCalledWith('user-123');
    expect(mockUserCommentLikesRepository.verifyLikeExists).toBeCalledWith('comment-123', 'user-123');
    expect(mockUserCommentLikesRepository.deleteLike).toBeCalledWith('comment-123', 'user-123');
    expect(mockUserCommentLikesRepository.addLike).toBeCalledTimes(0);
  });
});
