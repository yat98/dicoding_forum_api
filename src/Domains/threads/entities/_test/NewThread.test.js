const NewThread = require("../NewThread");

describe('NewThread entities', () => { 
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'Lorem',
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 'Lorem',
      body: ['Lorem ipsum sit dolor'],
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create NewThread entities correctly', () => {
    // Arrange
    const payload = {
      title: 'Lorem',
      body: 'Lorem ipsum sit dolor',
    };

    // Action  
    const newThread = new NewThread(payload);

    // Assert
    expect(newThread).toBeInstanceOf(NewThread);
    expect(newThread.title).toBe(payload.title);
    expect(newThread.body).toBe(payload.body);
  });
});