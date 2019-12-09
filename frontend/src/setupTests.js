import '@testing-library/jest-dom/extend-expect';
import fromEntries from 'object.fromentries';

if (!Object.fromEntries) {
	fromEntries.shim();
}

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;
