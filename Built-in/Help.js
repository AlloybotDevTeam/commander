"use strict";
exports.__esModule = true;
var Alloybot_1 = require("../../../../Alloybot");
var util_1 = require("util");
var lang = require('./lang.json');
var Commander = Alloybot_1.Alloybot.getModule('Commander');
var Help = /** @class */ (function () {
    function Help() {
        this.name = 'help';
        this.description = lang.description.help;
        this.usage = 'help <command>';
        this.example = 'help listcmds';
        this.type = lang.type[0];
        this.disabled = false;
    }
    Help.prototype.call = function (command) {
        var CommandClass = Commander.getCommand(command);
        var Response = {
            title: util_1.format(lang.label.help, CommandClass.name),
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
            : function () {
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
                value: CommandClass.subcommand
                    ? CommandClass.subcommand.join(', ')
                    : CommandClass.subcommand
            });
        return Response;
    };
    return Help;
}());
Commander.registerCommand(new Help());
