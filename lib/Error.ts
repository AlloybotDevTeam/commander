import { ICommand } from '../Commander';

export class NotLoadedError implements Error {
  name: string = 'NotLoadedError';
  message: string;
  stack?: string;
  constructor(Command: ICommand) {
    this.message = `Failed to load ${Command.name}. Parent ${
      Command.parent.name
    } is not loaded. Please wait.`;
  }
}
