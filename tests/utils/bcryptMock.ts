export const bcryptjsMock = {
  hash: jest.fn().mockImplementation((password) => `hashed_${password}`),
  compare: jest.fn().mockImplementation((password, hash) => hash === `hashed_${password}`),
};

export const mockBcrypt = (): void => {
  jest.mock('bcryptjs', () => bcryptjsMock);
};
