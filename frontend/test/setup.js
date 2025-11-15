import '@testing-library/jest-dom';

<<<<<<< HEAD
global.alert = () => {};
=======
global.jest = {
  fn: vi.fn,
  spyOn: vi.spyOn,
  clearAllMocks: vi.clearAllMocks,
  resetAllMocks: vi.resetAllMocks,
};
>>>>>>> 9eca3d52f2b796cafa8676a1e4b5b2950bae0e4f
