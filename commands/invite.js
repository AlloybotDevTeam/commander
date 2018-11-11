/********************
 * Alloybot      *
 * generateinvite.js *
 *********************/
const commander = alloybot.get('modules').get('commander');

module.exports = function() {
  let metadata = {
    name: 'invite',
    desc: lang.description.invite,
    usage: 'invite'.prefixed().inlineCode(),
    example: 'invite'.prefixed().inlineCode(),
    type: lang.type[0],
    disabled: false,
    reason: null //"For the bot creator only."
  };

  commander.commands.set(metadata.name, main);
  commander.metadata.set(metadata.name, metadata);
};

function main(message) {
  connections
    .get('discord')
    .client.generateInvite(commander.permissions)
    .then(invite => {
      message.channel.send('%s'.format(invite));
    })
    .catch(error => {
      message.channel.send(lang.general.errorBlock.format(error));
    });
}
