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

    this.mpdPlugin = this.commandRouter.pluginManager.getPlugin('music_service', 'mpd');
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

  resume() {
    this.commandRouter.stateMachine.setConsumeUpdateService('mpd');
    return this.mpdPlugin.sendMpdCommand('play', []);
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
      albumart: '/albumart?sourceicon=music_service/tidal/tidal.svg',
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
          availableListViews: [
            'list',
          ],
          items: [{
            service: 'tidal',
            type: 'tidal-category',
            title: 'My Playlists',
            artist: '',
            album: '',
            icon: 'fa fa-folder-open-o',
            uri: 'tidal/playlists',
          }],
        }],
        prev: {
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

    return this.mpdPlugin.sendMpdCommand('stop', [])
      .then(() => this.mpdPlugin.sendMpdCommand('clear', []))
      .then(() => this.mpdPlugin.sendMpdCommand(`load "${track.uri}"`, []))
      .fail(() => this.mpdPlugin.sendMpdCommand(`add "${track.uri}"`, []))
      .then(() => {
        this.commandRouter.stateMachine.setConsumeUpdateService('mpd');
        return this.mpdPlugin.sendMpdCommand('play', []);
      });
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
  explodeUri(uri) {
    this.commandRouter.logger.info(`[${Date.now()}] ControllerTidalPlugin::explodeUri`);

    const defer = libQ.defer();

    // Play
    if (uri.startsWith('tidal:track:')) {
      const uriSplitted = uri.split(':');
      this.api.getStreamURL({ id: uriSplitted[2] }, (data) => {
        defer.resolve({
          uri: data.url,
          service: 'tidal',
          name: 'data.name',
          artist: 'artist',
          album: 'album',
          type: 'song',
          duration: 300,
          tracknumber: 3,
          albumart: 'albumart',
          samplerate: 256,
          bitdepth: '16 bit',
          trackType: 'tidal',
        });
      });
    }

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
   * @param string
   * @return string
   */
  search(q) {
    this.commandRouter.logger.info(`[${Date.now()}] ControllerTidalPlugin::search ${JSON.stringify(q)}`);
    const defer = libQ.defer();
    const list = [];

    this.api.search({
      type: 'tracks,albums,artists',
      query: q.value,
      limit: 10,
    }, (data) => {
      list.push({
        type: 'title',
        title: 'Tidal Artists',
        availableListViews: ['list', 'grid'],
        items: data.artists.items.map(artist => ({
          service: 'tidal',
          type: 'folder',
          title: artist.name,
          albumart: artist.picture ? this.api.getArtURL(artist.picture, 1280) : '',
          uri: `tidal:artist:${artist.id}`,
        })),
      });
      list.push({
        type: 'title',
        title: 'Tidal Tracks',
        availableListViews: ['list'],
        items: data.tracks.items.map(track => ({
          service: 'tidal',
          type: 'song',
          title: track.title,
          artist: track.artists.name,
          album: track.album.title,
          albumart: track.album.cover ? this.api.getArtURL(track.album.cover, 1280) : '',
          uri: `tidal:track:${track.id}`,
        })),
      });
      list.push({
        type: 'title',
        title: 'Tidal Albums',
        availableListViews: ['list', 'grid'],
        items: data.albums.items.map(album => ({
          service: 'tidal',
          type: 'folder',
          title: album.title,
          albumart: album.cover ? this.api.getArtURL(album.cover, 1280) : '',
          uri: `tidal:album:${album.id}`,
        })),
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
};
