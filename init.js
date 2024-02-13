// init.js
const init = require('./utils/init');
const cli = require('./utils/cli');
const encrypt = require('./utils/encrypt');
const decrypt = require('./utils/decrypt');

const runImcrypt = async () => {
  init({ clear });

  const input = cli.input;
  const flags = cli.flags;
  const { clear } = flags;

  input.includes('help') && cli.showHelp(0);

  if (flags.encrypt) {
    await encrypt(flags);
  } else if (flags.decrypt) {
    await decrypt(flags);
  }

  const chalk = (await import('chalk')).default;

  console.log(
    chalk.bgMagenta(' Give it a star on github: ') +
      chalk.bold(' https://github.com/theninza/imcrypt ')
  );
};

module.exports = runImcrypt;
