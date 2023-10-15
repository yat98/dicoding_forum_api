const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');
const LikeCommentUseCase = require('../../../../Applications/use_case/LikeCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    this.putLikeCommentHandler = this.putLikeCommentHandler.bind(this);
  }

  async postCommentHandler(req, h) {
    const { threadId } = req.params;
    const { id: owner } = req.auth.credentials;
    const { content } = req.payload;
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const addedComment = await addCommentUseCase.execute({ threadId, content, owner });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(req, h) {
    const { threadId, commentId } = req.params;
    const { id: owner } = req.auth.credentials;
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute({ commentId, threadId, owner });

    const response = h.response({
      status: 'success',
    });
    return response;
  }

  async putLikeCommentHandler(req, h) {
    const { threadId, commentId } = req.params;
    const { id: owner } = req.auth.credentials;
    const likeCommentCommentUseCase = this._container.getInstance(LikeCommentUseCase.name);
    await likeCommentCommentUseCase.execute({ commentId, threadId, owner });

    const response = h.response({
      status: 'success',
    });
    return response;
  }
}

module.exports = CommentsHandler;
