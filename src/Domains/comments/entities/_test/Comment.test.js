const Comment = require('../Comment');

describe('Comment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'Lorem',
      date: new Date().toISOString(),
      content: 'lorem ipsum',
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: ['Lorem'],
      date: new Date().toISOString(),
      content: 'lorem ipsum',
      is_delete: 'false',
      count: '0',
    };

    // Action & Assert
    expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Comment entities correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'Lorem',
      date: new Date().toISOString(),
      content: 'lorem ipsum',
      is_delete: 'false',
      count: '0',
    };

    // Action
    const comment = new Comment(payload);

    // Assert
    expect(comment).toBeInstanceOf(Comment);
    expect(comment.id).toBe(payload.id);
    expect(comment.username).toBe(payload.username);
    expect(comment.date).toBe(payload.date);
    expect(comment.likeCount).toBe(0);
    expect(comment.content).toBe(payload.content);
  });

  it('should create Comment entities correctly when is delete', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'Lorem',
      date: new Date().toISOString(),
      content: 'lorem ipsum',
      is_delete: 'true',
      count: '0',
    };

    // Action
    const comment = new Comment(payload);

    // Assert
    expect(comment).toBeInstanceOf(Comment);
    expect(comment.id).toBe(payload.id);
    expect(comment.username).toBe(payload.username);
    expect(comment.date).toBe(payload.date);
    expect(comment.likeCount).toBe(0);
    expect(comment.content).toBe('**komentar telah dihapus**');
  });
});
