import { default as Alloybot, IFace, Util, ConfigBuilder } from '../../Alloybot';
import { NotLoadedError } from './util/Error';

class Commander extends IFace.IPlugin {
  protected Name: string = 'Commander';
  protected Dependencies: string[] = [];
  protected Dependants: IFace.IPlugin[] = Alloybot.getDependants(this.Name);
  protected Logger: Util.Logger = new Util.Logger(this.Name);
  protected Config;

  protected static Commands: Map<string, ICommand> = new Map();

  constructor() {
    super();
    let _config: ConfigBuilder = new ConfigBuilder('Commander', require('./package.json').version);
    _config.close();
    this.Config = _config.getConfig();
  }

  public isCommandRegistered(command: ICommand): boolean;
  public isCommandRegistered(command: string): boolean;
  public isCommandRegistered(command): boolean {
    if (typeof command == 'string') {
      return Commander.Commands.has(command);
    } else {
      return Commander.Commands.has(command.Name);
    }
  }

  public registerCommand(command: ICommand): void {
    if (command.Subcommand != null) {
      command.Subcommand.forEach(subcommand => {
        this.registerCommand(subcommand);
      });
    }

    Commander.Commands.set(command.Name, command);
    this.emit('command.registered', command.Name);
  }

  public getCommand(name: string): ICommand | Error {
    let CommandClass = Commander.Commands.get(name);
    if (this.isCommandRegistered(CommandClass)) {
      this.emit('command.request', this.getCommand.caller.name);
      return CommandClass;
    } else {
      this.emit('command.request.blocked', CommandClass.Name);
      return new NotLoadedError(CommandClass);
    }
  }

  public getAllCommands(): Map<string, ICommand> {
    return Commander.Commands;
  }
}

let INSTANCE = new Commander();

export default INSTANCE;

export abstract class ICommand {
  public readonly Name: string;
  public readonly Description: string;
  public readonly Usage: string;
  public readonly Example: string;
  public readonly Type: string;
  public readonly Disabled: boolean;
  public readonly Reason: string | null;
  public readonly Subcommand?: ICommand[];
}
