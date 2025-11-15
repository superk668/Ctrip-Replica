import '@testing-library/jest-dom';

global.jest = {
  fn: vi.fn,
  spyOn: vi.spyOn,
  clearAllMocks: vi.clearAllMocks,
  resetAllMocks: vi.resetAllMocks,
};