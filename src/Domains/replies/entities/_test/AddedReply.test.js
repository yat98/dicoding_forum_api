const AddedReply = require('../AddedReply');

describe('AddedReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'Lorem ipsum sit dolor',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: ['Lorem ipsum sit dolor'],
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create AddedReply entities correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'Lorem ipsum sit dolor',
      owner: 'user-123',
    };

    // Action
    const addedReplay = new AddedReply(payload);

    // Assert
    expect(addedReplay).toBeInstanceOf(AddedReply);
    expect(addedReplay.id).toBe(payload.id);
    expect(addedReplay.content).toBe(payload.content);
    expect(addedReplay.owner).toBe(payload.owner);
  });
});
