import { ICommand } from '../Commander';
import { default as Alloybot } from '../../../Alloybot';

const lang = require('./Lang.json');
let Commander = Alloybot.getPlugin('Commander');

class Commands implements ICommand {
  public Name: string = 'commands';
  public Description: string = lang.description.commands;
  public Usage: string = 'commands';
  public Example: string = 'commands';
  public Type: string = lang.type[0];
  public Disabled: boolean = false;
  public Reason: null;
  public Subcommand?: ICommand[];

  private Groups = {};

  constructor() {
    let Commands = <Map<String, ICommand>>Commander.getAllCommands();

    Commands.forEach(command => {
      try {
        this.Groups[command.Type].push(command.Name);
      } catch (error) {
        if (error) Commander.emit('command.error', { error: error, command: this.Name });
        this.Groups[command.Type] = [ command.Name ];
      }
    });
  }

  public call(): Object {
    let Response = {
      title: lang.label.commands,
      description: this.Description,
      field: []
    }

    Object.keys(this.Groups).forEach(group => {
      Response.field.push({
        name: group,
        value: this.Groups[group].join(', '),
        inline: false
      });
    });

    Commander.emit('command.success', this);
    return Response;
  }
}

Commander.registerCommand(new Commands());
