import { default as Alloybot, Type, Util, ConfigBuilder } from '../../Alloybot';
import { EventEmitter } from 'events';
import { NotLoadedError } from './util/Error';

export default class Commander extends EventEmitter implements Type.IPlugin {
  public readonly name: string = 'Commander';
  public readonly dependencies: string[] = [];
  public readonly dependants: Type.IPlugin[] = Alloybot.getDependants(this.name);
  public config;

  private commands: Map<string, ICommand> = new Map();
  private logger: Util.Logger = new Util.Logger(this.name);

  constructor() {
    super();
    let Config: ConfigBuilder = new ConfigBuilder('Commander', require('./package.json').version);
    Config.close();
    this.config = Config.getConfig();
  }

  public isCommandRegistered(command: ICommand): boolean;
  public isCommandRegistered(command: string): boolean;
  public isCommandRegistered(command): boolean {
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

  public getCommand(name: string): ICommand | Error {
    let CommandClass = this.commands.get(name);
    if (this.isCommandRegistered(CommandClass)) {
      this.emit('command.request', this.getCommand.caller.name);
      return CommandClass;
    } else {
      this.emit('command.request.blocked', CommandClass.name);
      return new NotLoadedError(CommandClass);
    }
  }

  public getAllCommands(): Map<string, ICommand> {
    return this.commands;
  }
}

Alloybot.registerPlugin(new Commander());

export interface ICommand {
  readonly name: string;
  readonly description: string;
  readonly usage: string;
  readonly example: string;
  readonly type: string;
  readonly disabled: boolean;
  readonly reason: string | null;
  readonly subcommand?: ICommand | null;
}
