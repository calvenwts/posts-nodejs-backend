import { Response } from 'express';

export const createMockResponse = (): {
  jsonMock: jest.Mock;
  statusMock: jest.Mock;
  sendMock: jest.Mock;
  mockResponse: Partial<Response>;
} => {
  const jsonMock = jest.fn().mockReturnThis();
  const statusMock = jest.fn().mockReturnThis();
  const sendMock = jest.fn().mockReturnThis();

  const mockResponse = {
    json: jsonMock,
    status: statusMock,
    send: sendMock,
  } as Partial<Response>;

  return { jsonMock, statusMock, sendMock, mockResponse };
};
