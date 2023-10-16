const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should throw error when thread not exists', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-xxx',
      content: 'Lorem ipsum sit dolor',
      owner: 'user-123',
    };

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: 'John Doe',
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.addComment = jest.fn(() => Promise.resolve(mockAddedComment));
    mockThreadRepository.verifyThreadExists = jest.fn(() => Promise.reject(new NotFoundError()));

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(() => addCommentUseCase.execute(useCasePayload))
      .rejects.toThrowError(NotFoundError);
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith('thread-xxx');
    expect(mockCommentRepository.addComment).not.toBeCalled();
  });

  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      content: 'Lorem ipsum sit dolor',
      owner: 'user-123',
    };

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: 'John Doe',
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.addComment = jest.fn(() => Promise.resolve(mockAddedComment));
    mockThreadRepository.verifyThreadExists = jest.fn(() => Promise.resolve());

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment({
      threadId: 'thread-123',
      content: 'Lorem ipsum sit dolor',
      owner: 'user-123',
    }));
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith('thread-123');
    expect(addedComment).toEqual(new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: 'John Doe',
    }));
  });
});
