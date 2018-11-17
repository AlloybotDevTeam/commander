import { IModule, Alloybot, Logger } from '../../../Alloybot';
import { EventEmitter } from 'events';
import { NotLoadedError } from './lib/Error';

export class Commander extends EventEmitter implements IModule {
  public readonly name: String = 'Commander';
  public readonly dependencies: String[] = [];

  private commands: Map<String, ICommand> = new Map();
  private logger: Logger = new Logger(this.name);

  constructor() {
    super();
  }

  public isCommandRegistered(command: ICommand): Boolean;
  public isCommandRegistered(command: String): Boolean;
  public isCommandRegistered(command): Boolean {
    if (typeof command == 'string') {
      return this.commands.has(command);
    } else {
      return this.commands.has(command.name);
    }
  }

  public registerCommand(command: ICommand): void {
    if (command.subcommand != null) this.registerCommand(command.subcommand);

    this.commands.set(command.name, command);
    this.emit('command.registered', command.name);
  }

  public getCommand(name: String): ICommand | Error {
    let CommandClass = this.commands.get(name);
    if (this.isCommandRegistered(CommandClass)) {
      this.emit('command.request', this.getCommand.caller.name);
      return CommandClass;
    } else {
      this.emit('command.request.blocked', CommandClass.name);
      return new NotLoadedError(CommandClass);
    }
  }

  public getAllCommands(): Map<String, ICommand> {
    return this.commands;
  }
}

Alloybot.registerModule(new Commander());

export interface ICommand {
  readonly name: String;
  readonly description: String;
  readonly usage: String;
  readonly example: String;
  readonly type: String;
  readonly disabled: Boolean;
  readonly reason: String | null;
  readonly subcommand?: ICommand | null;
}
