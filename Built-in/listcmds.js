/***************
 * Alloybot *
 * listcmds.js   *
 ****************/
const commander = alloybot.get('modules').get('commander');

module.exports = function() {
  let metadata = {
    name: 'cmdlist',
    desc: lang.description.cmdlist,
    usage: 'cmdlist'.prefixed().inlineCode(),
    example: 'cmdlist'.prefixed().inlineCode(),
    type: lang.type[0],
    disabled: false,
    reason: null
  };

  commander.commands.set(metadata.name, main);
  commander.metadata.set(metadata.name, metadata);
};

function main(message) {
  let embed = _connections.get('discord').embed();

  Object.keys(commander.groups).forEach(group => {
    if (commander.groups[group].length > 0)
      embed.addField(group, commander.groups[group].join(', '));
    else embed.addField(group, lang.label.empty);
  });

  message.channel.send(embed.setTimestamp());
}
