const libQ = require('kew');
const Conf = require('v-conf');
const TidalAPI = require('tidalapi');
/*
const ffmpeg = require('fluent-ffmpeg');
const Speaker = require('speaker');
const wav = require('wav');
*/

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

    this.api = new TidalAPI({
      username: '',
      password: '',
      token: 'BI218mwp9ERZ3PFI', // BI218mwp9ERZ3PFI
      quality: 'HI_RES',
    });

    this.addToBrowseSources();
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

	  this.commandRouter.volumioAddToBrowseSources({
      name: 'Tidal',
      uri: 'tidal',
      plugin_type: 'music_service',
      plugin_name: 'tidal',
      albumart: '/albumart?sourceicon=music_service/tidal/tidal.svg'
    });
  }

  /**
   * handleBrowseUri
   * @return void
   */
  handleBrowseUri() {
    this.commandRouter.logger.info(`[${Date.now()}] ControllerTidalPlugin::handleBrowseUri`);
    return libQ.resolve({
    	navigation: {
    		lists: [{
    			'availableListViews': [
    				'list',
    			],
    			'items': [{
    					service: 'tidal',
    					type: 'tidal-category',
    					title: 'My Playlists',
    					artist: '',
    					album: '',
    					icon: 'fa fa-folder-open-o',
    					uri: 'tidal/playlists',
    				},
    			],
    		}],
    		'prev': {
    			uri: 'tidal',
    		},
    	},
    });
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
    const list = [];

    this.api.search({
      type: 'tracks,albums,artists',
      query: 'Dream Theater',
      limit: 1,
    }, (data) => {
      list.push({
        type: 'title',
        title: 'Tidal Artists',
        availableListViews: ['list', 'grid'],
        items: data.artists,
      });
      list.push({
        type: 'title',
        title: 'Tidal Tracks',
        availableListViews: ['list'],
        items: [{
          service: 'tidal',
    			type: 'song',
    			title: 'track.name',
    			artist: 'track.artists[0].name',
    			album: 'track.album.name',
    			albumart: 'albumart',
    			uri: 'track.uri'
        }],
      });
      list.push({
        type: 'title',
        title: 'Tidal Albums',
        availableListViews: ['list', 'grid'],
        items: data.albums,
      });

      defer.resolve(list);
    });

    return defer.promise;
  }

  /**
   * saveTidalAccount
   * @return void
   */
  saveAccount(data) {
    const defer = libQ.defer();

    this.config.set('username', data.username);
    this.config.set('password', data.password);
    this.config.set('token', data.token);
    this.config.set('bitrate', data.bitrate);

    this.api = new TidalAPI({
      username: data.username,
      password: data.password,
      token: data.token,
      quality: 'HI_RES',
    });

    this.commandRouter.logger.info(`[${Date.now()}] ControllerTidalPlugin::saveTidalAccount - ${data.username}`);

    return defer.promise;
  }

  /*
  |--------------------------------------------------------------------------
  | Temporary methods
  |--------------------------------------------------------------------------
  */

  /**
   * test play
   * @return void
   */
  _playTest() {
    /*
    this.api.getStreamURL({ id: 73725124 }, (data) => {
      const reader = new wav.Reader();
      reader.on('format', (format) => {
        reader.pipe(new Speaker(format));
      });
      ffmpeg(data.url).format('wav')
        .pipe(new Speaker(), { end: true })
        .on('finish', () => {
          // console.log('track finished');
        });
    });
    */
  }
};
