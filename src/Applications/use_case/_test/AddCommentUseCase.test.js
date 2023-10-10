const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const NewComment = require("../../../Domains/comments/entities/NewComment");
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

    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository
    });

    // Action
    const addedComment = await addCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.addComment).toBeCalledWith(new NewComment({
      threadId: 'thread-123',
      content: 'Lorem ipsum sit dolor',
      owner: 'user-123',
    }));
    expect(addedComment).toEqual(new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: 'John Doe',
    }));
  });
});