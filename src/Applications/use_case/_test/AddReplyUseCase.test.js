const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'Lorem ipsum sit dolor',
      owner: 'user-123',
    };

    const mockAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: 'John Doe',
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockCommentRepository.verifyCommentExists = jest.fn(() => Promise.resolve());
    mockThreadRepository.verifyThreadExists = jest.fn(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn(() => Promise.resolve(mockAddedReply));

    const addReplyUseCase = new AddReplyUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const addedReply = await addReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockReplyRepository.addReply).toBeCalledWith(new NewReply({
      commentId: 'comment-123',
      content: 'Lorem ipsum sit dolor',
      owner: 'user-123',
    }));
    expect(mockThreadRepository.verifyThreadExists).toBeCalledWith('thread-123');
    expect(mockCommentRepository.verifyCommentExists).toBeCalledWith('comment-123');
    expect(addedReply).toEqual(new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: 'John Doe',
    }));
  });
});
