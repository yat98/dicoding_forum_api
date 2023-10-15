const CommentRepository = require('../../../Domains/comments/CommentRepository');
const Comment = require('../../../Domains/comments/entities/Comment');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const Reply = require('../../../Domains/replies/entities/Reply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const Thread = require('../../../Domains/threads/entities/Thread');
const DetailThreadUseCase = require('../DetailThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the detail thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const mockThread = new Thread({
      id: 'thread-123',
      title: 'Lorem',
      body: 'lorem ipsum',
      date: new Date().toISOString(),
      username: 'dicoding',
    });

    const mockCommentOne = new Comment({
      id: 'comment-123',
      username: 'John',
      date: new Date().toISOString(),
      content: 'lorem',
      is_delete: 'true',
      count: '0',
    });

    const mockCommentTwo = new Comment({
      id: 'comment-124',
      username: 'James',
      date: new Date().toISOString(),
      content: 'ipsum',
      is_delete: 'false',
      count: '1',
    });

    const mockReply = new Reply({
      id: 'reply-124',
      username: 'James',
      date: new Date().toISOString(),
      content: 'ipsum',
      is_delete: 'false',
      comment_id: 'comment-123',
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve([
      mockCommentOne, mockCommentTwo,
    ]));
    mockReplyRepository.getRepliesByThreadId = jest.fn(() => Promise.resolve([mockReply]));

    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const detailThread = await detailThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith('thread-123');
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith('thread-123');
    expect(detailThread).toEqual(new DetailThread({
      thread: mockThread,
      comments: [
        mockCommentOne,
        mockCommentTwo,
      ],
      replies: [
        mockReply,
      ],
    }));
  });
});
