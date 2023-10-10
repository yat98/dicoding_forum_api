const NewComment = require("../NewComment");

describe('NewComment entities', () => { 
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'Lorem ipsum sit dolor',
    };

    // Action & Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: ['Lorem ipsum sit dolor'],
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewComment entities correctly', () => {
    // Arrange
    const payload = {
      content: 'Lorem ipsum sit dolor',
      owner: 'user-123',
    };

    // Action  
    const newThread = new NewComment(payload);

    // Assert
    expect(newThread).toBeInstanceOf(NewComment);
    expect(newThread.content).toBe(payload.content);
    expect(newThread.owner).toBe(payload.owner);
  });
});