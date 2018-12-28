import { ICommand } from '../Commander';
import { default as Alloybot } from '../../../Alloybot';
import { format } from 'util';

const lang = require('./Lang.json');
let Commander = Alloybot.getPlugin('Commander');

class Help implements ICommand {
  public readonly Name: string = 'help';
  public readonly Description: string = lang.description.help;
  public readonly Usage: string = 'help <command>';
  public readonly Example: string = 'help listcmds';
  public readonly Type: string = lang.type[0];
  public readonly Disabled: boolean = false;
  public readonly Reason: null;
  public readonly Subcommand?: ICommand[];

  public call(command: string): Object {
    const CommandClass = <ICommand>Commander.getCommand(command);

    let Response = {
      title: format(lang.label.help, CommandClass.Name),
      description: CommandClass.Description,
      field: []
    };

    Response.field.push({
      name: lang.label.usage,
      value: CommandClass.Usage,
      inline: false
    });

    Response.field.push({
      name: lang.label.example,
      value: CommandClass.Example,
      inline: false
    });

    Response.field.push({
      name: lang.label.type,
      value: CommandClass.Type,
      inline: true
    });

    CommandClass.Disabled == false
      ? Response.field.push({
          name: lang.label.enabled,
          value: lang.symbol.enabled,
          inline: true
        })
      : () => {
          Response.field.push({
            name: lang.label.enabled,
            value: lang.symbol.disabled,
            inline: true
          });
          Response.field.push({
            name: lang.label.reason,
            value: CommandClass.Reason
              ? CommandClass.Reason
              : lang.general.reason
          });
        };

    if (CommandClass.Subcommand)
      Response.field.push({
        name: lang.label.subcommand,
        value: CommandClass.Subcommand
          ? CommandClass.Subcommand.join(', ')
          : CommandClass.Subcommand
      });

    Commander.emit('command.success', this);
    return Response;
  }
}

Commander.registerCommand(new Help());
