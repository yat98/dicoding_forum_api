const Reply = require("../Reply");

describe('Reply entities', () => { 
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'Lorem',
      date: new Date().toISOString(),
      content: 'lorem ipsum',
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: ['Lorem'],
      date: new Date().toISOString(),
      content: 'lorem ipsum',
      is_delete: 'false',
    };

    // Action & Assert
    expect(() => new Reply(payload)).toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Reply entities correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'Lorem',
      date: new Date().toISOString(),
      content: 'lorem ipsum',
      is_delete: 'false',
    };

    // Action  
    const newReply = new Reply(payload);

    // Assert
    expect(newReply).toBeInstanceOf(Reply);
    expect(newReply.id).toBe(payload.id);
    expect(newReply.username).toBe(payload.username);
    expect(newReply.date).toBe(payload.date);
    expect(newReply.content).toBe(payload.content);
  });

  it('should create Reply entities correctly when is delete', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'Lorem',
      date: new Date().toISOString(),
      content: 'lorem ipsum',
      is_delete: 'true',
    };

    // Action  
    const reply = new Reply(payload);

    // Assert
    expect(reply).toBeInstanceOf(Reply);
    expect(reply.id).toBe(payload.id);
    expect(reply.username).toBe(payload.username);
    expect(reply.date).toBe(payload.date);
    expect(reply.content).toBe('**balasan telah dihapus**');
  });
});