const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const NewThread = require("../../../Domains/threads/entities/NewThread");
const AddThreadUseCase = require("../AddThreadUseCase");

describe('AddThreadUseCase', () => {
  it('should orchestrating the add user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'Lorem',
      body: 'Lorem ipsum sit dolor'
    };

    const mockAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'John Doe',
    });

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread({
      title: 'Lorem',
      body: 'Lorem ipsum sit dolor'
    }));
    expect(addedThread).toEqual(new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: 'John Doe',
    }));
  });
});