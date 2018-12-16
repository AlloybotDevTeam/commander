import { ICommand } from '../Commander';
import { default as Alloybot } from '../../../Alloybot';
import { format } from 'util';

const lang = require('./lang.json');
let Commander = Alloybot.getPlugin('Commander');

class Help implements ICommand {
  readonly name: string = 'help';
  readonly description: string = lang.description.help;
  readonly usage: string = 'help <command>';
  readonly example: string = 'help listcmds';
  readonly type: string = lang.type[0];
  readonly disabled: boolean = false;
  readonly reason: null;
  readonly subcommand?: null;

  public call(command: string): Object {
    const CommandClass = Commander.getCommand(command);

    let Response = {
      title: format(lang.label.help, CommandClass.name),
      description: CommandClass.description,
      field: []
    };

    Response.field.push({
      name: lang.label.usage,
      value: CommandClass.usage,
      inline: false
    });

    Response.field.push({
      name: lang.label.example,
      value: CommandClass.example,
      inline: false
    });

    Response.field.push({
      name: lang.label.type,
      value: CommandClass.type,
      inline: true
    });

    CommandClass.disabled == false
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
            value: CommandClass.reason
              ? CommandClass.reason
              : lang.general.reason
          });
        };

    if (CommandClass.subcommand)
      Response.field.push({
        name: lang.label.subcommand,
        value: <ICommand[]>CommandClass.subcommand
          ? CommandClass.subcommand.join(', ')
          : CommandClass.subcommand
      });

    return Response;
  }
}

Commander.registerCommand(new Help());
