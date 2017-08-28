const Tidal = require('./index.js');

const tidal = new Tidal({
  coreCommand: {
    logger: console,
  },
});


tidal.onStart();
tidal.search();
