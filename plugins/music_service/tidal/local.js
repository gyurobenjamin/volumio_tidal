const Tidal = require('./index.js');

const tidal = new Tidal({
  coreCommand: {
    logger: console,
    volumioAddToBrowseSources: () => {},
  },
});

tidal.onStart();
tidal.search({ value: 'dream theater' })
  .then((ret) => {
    console.log(JSON.stringify(ret));
  });
