import { observable, computed, action } from 'mobx';

export class AppState {
  constructor({ count, name } = { count: 0, name: 'Eric' }) {
    this.count = count;
    this.name = name;
  }

  @observable count;

  @observable name;

  @computed get msg() {
    return `${this.name} say count is ${this.count}`;
  }

  @action changeName(name) {
    this.name = name;
  }

  @action add() {
    this.count += 1;
  }

  toJson() {
    return {
      count: this.count,
      name: this.name,
    };
  }
}
const appState = new AppState();

export default appState;
