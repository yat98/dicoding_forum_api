const DetailThread = require("../../Domains/threads/entities/DetailThread");

class DetailThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    return new DetailThread({
      thread,
      comments,
    });
  }
}

module.exports = DetailThreadUseCase;