const libQ = require('kew');
const Conf = require('v-conf');

module.exports = class ControllerTidaPlugin {
  constructor(context) {
    this.context = context;
    this.commandRouter = this.context.coreCommand;
    this.logger = this.context.logger;
    this.configManager = this.context.configManager;

    this.commandRouter.logger.info(`[${Date.now()}] ControllerTidalPlugin::constructor`);
  }

  /**
   * onVolumioStart
   * @return
   */
  onVolumioStart() {
    this.commandRouter.logger.info(`[${Date.now()}] ControllerTidalPlugin::onVolumioStart`);

    const configFile = this.commandRouter
      .pluginManager
      .getConfigurationFile(this.context, 'config.json');
    this.config = new Conf();
    this.config.loadFile(configFile);
    return libQ.resolve();
  }

  /**
   * onStart
   * @return
   */
  onStart() {
    this.commandRouter.logger.info(`[${Date.now()}] ControllerTidalPlugin::onStart`);

    const defer = libQ.defer();
    // Once the Plugin has successfull started resolve the promise
    defer.resolve();
    return defer.promise;
  }

  /**
   * onStop
   * @return
   */
  onStop() {
    this.commandRouter.logger.info(`[${Date.now()}] ControllerTidalPlugin::onStop`);

    const defer = libQ.defer();
    // Once the Plugin has successfull stopped resolve the promise
    defer.resolve();
    return libQ.resolve();
  }

  /**
   * onRestart
   * @return void
   */
  onRestart() {
    this.commandRouter.logger.info(`[${Date.now()}] ControllerTidalPlugin::onRestart`);
    // Optional, use if you need it
  }

  /*
  |--------------------------------------------------------------------------
  | Configuration Methods
  |--------------------------------------------------------------------------
  */

  /**
   * getUIConfig
   * @return promise
   */
  getUIConfig() {
    this.commandRouter.logger.info(`[${Date.now()}] ControllerTidalPlugin::getUIConfig`);

    const defer = libQ.defer();
    const self = this;
    const langCode = this.commandRouter.sharedVars.get('language_code');

    self.commandRouter
      .i18nJson(`${__dirname}/i18n/strings_${langCode}.json`,
        `${__dirname}/i18n/strings_en.json`,
        `${__dirname}/UIConfig.json`)
      .then((uiconf) => {
        defer.resolve(uiconf);
      })
      .fail(() => {
        defer.reject(new Error());
      });

    return defer.promise;
  }

  /**
   * setUIConfig
   * @return void
   */
  setUIConfig() {
    this.commandRouter.logger.info(`[${Date.now()}] ControllerTidalPlugin::setUIConfig`);
    // Perform your installation tasks here
  }

  /**
   * getConf
   * @return void
   */
  getConf() {
    this.commandRouter.logger.info(`[${Date.now()}] ControllerTidalPlugin::getConf`);
    // Perform your installation tasks here
  }

  /**
   * setConf
   * @return void
   */
  setConf() {
    this.commandRouter.logger.info(`[${Date.now()}] ControllerTidalPlugin::setConf`);
    // Perform your installation tasks here
  }

  /*
  |--------------------------------------------------------------------------
  | Playback controls
  |--------------------------------------------------------------------------
  */

  /**
   * addToBrowseSources
   * @return void
   */
  addToBrowseSources() {
    this.commandRouter.logger.info(`[${Date.now()}] ControllerTidalPlugin::addToBrowseSources`);

    // Use this function to add your music service plugin to music sources
    // d: {name: 'Spotify', uri: 'spotify', plugin_type:'music_service', plugin_name:'spop'};
    // this.commandRouter.volumioAddToBrowseSources(data);
  }

  /**
   * handleBrowseUri
   * @return void
   */
  handleBrowseUri() {
    this.commandRouter.logger.info(`[${Date.now()}] ControllerTidalPlugin::handleBrowseUri`);
  }

  /**
   * Define a method to clear, add, and play an array of tracks
   * @return
   */
  clearAddPlayTrack(track) {
    this.commandRouter.logger.info(`[${Date.now()}] ControllerTidalPlugin::clearAddPlayTrack`);
    this.commandRouter.logger.info(JSON.stringify(track));
    return this.sendSpopCommand('uplay', [track.uri]);
  }

  /**
   * seek
   * @return
   */
  seek(timepos) {
    this.commandRouter.logger.info(`[${Date.now()}] ControllerTidalPlugin::seek to ${timepos}`);
    return this.sendSpopCommand(`seek ${timepos}`, []);
  }

  /**
   * stop
   * @return void
   */
  stop() {
    this.commandRouter.logger.info(`[${Date.now()}] ControllerTidalPlugin::stop`);
  }

  /**
   * pause
   * @return void
   */
  pause() {
    this.commandRouter.logger.info(`[${Date.now()}] ControllerTidalPlugin::pause`);
  }

  /**
   * getState
   * @return void
   */
  getState() {
    this.commandRouter.logger.info(`[${Date.now()}] ControllerTidalPlugin::getState`);
  }

  /**
   * parseState
   * @return void
   */
  parseState() {
    this.commandRouter.logger.info(`[${Date.now()}] ControllerTidalPlugin::parseState`);
    // Use this method to parse the state and eventually send it with the following function
  }

  /**
   * pushState
   * @return
   */
  pushState(state) {
    this.commandRouter.logger.info(`[${Date.now()}] ControllerTidalPlugin::pushState`);

    return this.commandRouter.servicePushState(state, this.servicename);
  }

  /**
   * explodeUri
   * @return
   */
  explodeUri() {
    this.commandRouter.logger.info(`[${Date.now()}] ControllerTidalPlugin::explodeUri`);

    const defer = libQ.defer();
    // Mandatory: retrieve all info for a given URI
    return defer.promise;
  }

  /**
   * getAlbumArt
   * @return string
   */
  getAlbumArt(data, path) {
    this.commandRouter.logger.info(`[${Date.now()}] ControllerTidalPlugin::getAlbumArt`);

    return `${data}${path}`;
  }

  /**
   * search
   * @return string
   */
  search() {
    this.commandRouter.logger.info(`[${Date.now()}] ControllerTidalPlugin::search`);

    const defer = libQ.defer();
    // Mandatory, search. You can divide the search in sections using following functions
    return defer.promise;
  }

  /**
   * saveTidalAccount
   * @return void
   */
  saveTidalAccount() {
    this.commandRouter.logger.info(`[${Date.now()}] ControllerTidalPlugin::saveTidalAccount`);
  }
};
