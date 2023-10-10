const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const NewComment = require("../../../Domains/comments/entities/NewComment");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddCommentUseCase = require("../AddCommentUseCase");

describe('AddCommentUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
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

    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));
    mockThreadRepository.verifyThreadExists = jest.fn()
      .mockImplementation(() => Promise.resolve());

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