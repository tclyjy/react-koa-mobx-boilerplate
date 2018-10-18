import { AppState } from './appState';

export default {
  AppState,
};

export const createStoreMap = () => (
  {
    appState: new AppState(),
  }
);
