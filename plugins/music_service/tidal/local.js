const Tidal = require('./index.js');

const tidal = new Tidal({
  coreCommand: {
    logger: console,
    volumioAddToBrowseSources: () => {},
    pluginManager: {
      getPlugin: () => {},
    },
  },
});

tidal.onStart();
/*
tidal.search({ value: 'dream theater' })
  .then((ret) => {
    console.log(JSON.stringify(ret));
  });
*/
tidal.explodeUri('tidal:track:22560696');
