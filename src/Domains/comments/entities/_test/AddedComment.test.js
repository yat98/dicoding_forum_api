const AddedComment = require("../AddedComment");

describe('AddedComment entities', () => { 
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'Lorem ipsum sit dolor',
      owner: 'user-123'
    };

    // Action & Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: ['Lorem ipsum sit dolor'],
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedComment entities correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'Lorem ipsum sit dolor',
      owner: 'user-123',
    };

    // Action  
    const newThread = new AddedComment(payload);

    // Assert
    expect(newThread).toBeInstanceOf(AddedComment);
    expect(newThread.id).toBe(payload.id);
    expect(newThread.content).toBe(payload.content);
    expect(newThread.owner).toBe(payload.owner);
  });
});