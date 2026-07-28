var $body = $('body');
var $loadingSpinner = $('.vjs-loading-spinner');
var $settingList = $('.vjs-settings-list');
var $firstCard = false;

var isEdge = videojs.browser.IS_EDGE;
var isAndroid = videojs.browser.IS_ANDROID || navigator.userAgent.match(/Android/i);
var isIOS = videojs.browser.IS_IOS || /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
var ua = navigator.userAgent.toLowerCase();
var isChrome = (ua.indexOf('chrome') > -1);
var isSafari = (ua.indexOf('safari') > -1 && ua.indexOf('chrome') === -1);
var isFirefox = typeof InstallTrigger !== 'undefined' || videojs.browser.IS_FIREFOX;
var chromeAndroid = isChrome && isAndroid;

var relatedCountdown = false;
var hasRelated = false;
var api = false;
var AdsExist = false;
var adCurrent = false;
var adCurrentApiAds = false;
var loopSegment = 0;
var dataSegmenterB = 0;
var lastMutedDAIStatus = true;
var playerVersion = 'player';
var player;
var playerDAI;
var currentPlayer;

var _base64Tkn = typeof _cxTknRaw !== 'undefined' ? _cxTknRaw.split('').reverse().join('') : '';
var tokenApiUrl = _base64Tkn ? atob(_base64Tkn) : '';

//var adblock_CSAI_Activo = (typeof google === 'undefined' || !google.ima);
//var adblock_DAI_Activo  = (typeof google === 'undefined' || !google.ima || !google.ima.dai);

//if (typeof haveAds !== 'undefined' && haveAds === 1 && adblock_CSAI_Activo) { haveAds = 0; }
//if (typeof DAI !== 'undefined' && DAI === 1 && adblock_DAI_Activo) { DAI = 0; }

var adblock_CSAI_Activo = (typeof google === 'undefined' || !google.ima);
var adblock_DAI_Activo = (typeof google === 'undefined' || !google.ima || !google.ima.dai);

if (adblock_CSAI_Activo) {
    if (typeof haveAds !== 'undefined') haveAds = 0;
    if (typeof playout !== 'undefined') playout = 0;
    if (typeof apiAds !== 'undefined') apiAds = 0;
}

if (adblock_DAI_Activo) {
    if (typeof DAI !== 'undefined') DAI = 0;
}

var imaADS = (haveAds === 0) ? 1 : 0;

if (isEdge) preloadPlayer = 'auto';
if ((typeof Mobile !== 'undefined' && Mobile === true) && (streamAutoplay == 1)) { autoplayPlayer = true; mutedPlayer = true; }
if (isSafari && (streamAutoplay == 1)) { mutedPlayer = true; if (contentType == 'audio') { autoplayPlayer = false; streamAutoplay = 0; mutedPlayer = false; } }
if (isFirefox && (streamAutoplay == 1)) { mutedPlayer = true; if (contentType == 'audio') { autoplayPlayer = false; streamAutoplay = 0; mutedPlayer = false; } }
if (isChrome && (streamType == 'live') && (streamAutoplay == 1)) mutedPlayer = true;
if (streamAutoplay == 1) autoplayPlayer = true;
if (streamVolume == 0) mutedPlayer = true;
if (streamType == 'live') liveUiDVR = true;
if (fastDVR) { liveUiDVR = false; mutedPlayer = false; lastMutedDAIStatus = false; }
if ((typeof savedata !== 'undefined' && savedata == 1) && (streamAutoplay == 0)) { mutedPlayer = true; autoplayPlayer = true; }
if ((typeof videoOnly !== 'undefined' && videoOnly === true) && (streamType == 'live')) mutedPlayer = false;
lastMutedDAIStatus = mutedPlayer;

var applyTextTrackSettings = function (activePlayer) {
    if (activePlayer && activePlayer.textTrackSettings) {
        setTimeout(function () {
            const modalTextTrackSettings = document.querySelector('.vjs-text-track-settings');
            if (!modalTextTrackSettings) return;
            const windowOpacity = modalTextTrackSettings.querySelector('.vjs-window-opacity');
            if (!windowOpacity) return;
            const windowOpacitySelect = windowOpacity.querySelector('select');
            if (!windowOpacitySelect) return;
            windowOpacitySelect.selectedIndex = 1;
            windowOpacitySelect.dispatchEvent(new Event('change'));
        }, 500);
    }
};

var addRudoIcon = function () {
    var $container = $('.vjs-control-bar');
    var template = '<a href="' + aboutLink + '" target="_blank" title="' + aboutText + '" class="vjs-rudo-control vjs-control vjs-button"></a>';
    $container.append(template);
};

var addGifInPlayer = function () {
    var $gif = $('.rudo-gif');
    var $wrapper = $('.video-js');
    if ($gif && $wrapper) $gif.appendTo($wrapper);
};

var initCustomRightClick = function () {
    var $contextMenu;
    var contextMenuInterval = false;
    var disableContextMenu = function () { document.addEventListener('contextmenu', function (e) { e.preventDefault(); }, false); createContextMenu(); };
    var createContextMenu = function () { $body.append('<a href="' + aboutLinkDPS + '" target="_blank" class="player-context-menu is-hidden">' + aboutTextDPS + '</a>'); $contextMenu = $('.player-context-menu'); };
    var rightClickListener = function () {
        $(document).on('contextmenu', function (event) {
            var cursorY = event.clientY, cursorX = event.clientX, windowWidth = window.innerWidth, contextMenuWidth = $contextMenu.outerWidth();
            if ((contextMenuWidth + cursorX) >= windowWidth) { $contextMenu.css({ top: cursorY, left: (cursorX - contextMenuWidth) }); } else { $contextMenu.css({ top: cursorY, left: cursorX }); }
            $contextMenu.removeClass('is-hidden');
            if (contextMenuInterval !== false) clearInterval(contextMenuInterval);
            contextMenuInterval = setTimeout(function () { $contextMenu.addClass('is-hidden'); }, 2500);
        });
    };
    disableContextMenu();
    rightClickListener();
};

var hidePoster = function () { $('html').addClass('hide-poster'); };
var showPoster = function () { $('html').removeClass('hide-poster'); if (contentType == "audio") $('#rudo-video_html5_api').attr('poster', posterIMG); };

function get_current_segment_info(obj) {
    var target_media = obj.tech_.vhs.playlists.media();
    var snapshot_time = obj.currentTime();
    var segment;
    for (var i = 0, l = target_media.segments.length; i < l; i++) {
        if (snapshot_time < target_media.segments[i].end) { segment = target_media.segments[i]; break; }
    }
    return segment || target_media.segments[0];
}

function playPromiseSafe(targetPlayer) {
    if (!targetPlayer) return;

    targetPlayer.playsinline(true);

    console.log('[DEBUG] playPromiseSafe INICIO - lastMutedDAIStatus:', lastMutedDAIStatus, '| targetPlayer.muted() original:', targetPlayer.muted());

    // Forzamos al reproductor a adoptar el estado que guardó nuestra variable global
    // Ignorando la restauración automática (errónea) de sonido que hace el IMA SDK:
    targetPlayer.muted(lastMutedDAIStatus);

    if (lastMutedDAIStatus === true || isIOS) {
        targetPlayer.muted(true);
    } else {
        targetPlayer.muted(false); targetPlayer.volume(streamVolume || 0.7);
    }
    
    console.log('[DEBUG] playPromiseSafe PRE-PLAY - targetPlayer.muted() actual:', targetPlayer.muted());

    var playAttempt = targetPlayer.play();
    if (playAttempt !== undefined) {
        playAttempt.then(function () { 
             console.log('[DEBUG] playAttempt resuelto sin problemas');
        }).catch(function (error) {
            console.log('[DEBUG] playAttempt ERROR interceptado:', error.name, error.message);
            targetPlayer.muted(true);
            var retry = targetPlayer.play();
            if (retry !== undefined) {
                retry.catch(function (e2) { console.warn('Autoplay bloqueado retry:', e2); });
            }
        });
    }
}

function buildPlayer() {
    var vjsOptions = { responsive: true, crossorigin: 'anonymous', autoplay: autoplayPlayer, muted: mutedPlayer, preload: preloadPlayer, loop: loopPlayer, liveui: liveUiDVR, errorDisplay: false };

    if (dpsssai == 1) {
        vjsOptions.liveTracker = { trackingThreshold: 30, liveTolerance: 15 };
        vjsOptions.html5 = { nativeAudioTracks: false, nativeVideoTracks: false, vhs: { overrideNative: !videojs.browser.IS_ANY_SAFARI, handleManifestRedirects: true, experimentalBufferBasedABR: true, allowSeeksWithinUnsafeLiveWindow: true, liveSyncDurationCount: 3, liveMaxLatencyDurationCount: 10 } };
    } else if (isSafari) {
        vjsOptions.html5 = { nativeVideoTracks: false, nativeAudioTracks: false, nativeTextTracks: true, vhs: { overrideNative: false, debug: true }, hlsjsConfig: {} };
    }

    player = videojs('rudo-video', vjsOptions);
    player.nuevo({ relatedMenu: false, shareMenu: false, errordisplay: false, resOnly: true });
    setupManualTimeLimit(player);
    currentPlayer = player;
    player.chromecast({ appId: '94369AED', button: 'controlbar', metatitle: titleVideo, metasubtitle: videoAuthor });

    var sourceToLoad = streamURL;
    if (typeof haveAds !== 'undefined' && haveAds === 1 && typeof DAI !== 'undefined' && DAI === 1) {
        if (isIOS || isSafari) { sourceToLoad = streamURL; }
        else { sourceToLoad = 'https://rudo.video/rudo.m3u8'; }
    }

    if (!player.__timeLimitExceeded) {
        player.src({ src: sourceToLoad, type: typeStreamURL });
        if (dpsssai == 1) player.dpsSsai();
        if ((haveAds == 1) || (playout == 1) || (apiAds == 1)) { player.ima(options); }
    }

    player.on('ready', function () {
        if (fastDVR) {
            $('.rudo-wrapper--is-live').removeClass('rudo-wrapper--is-live');
        }
        var startEvent = (isIOS || isAndroid) ? 'touchend' : 'click';
        if (streamAutoplay == 0) { player.one(startEvent, function () { if ((haveAds == 1) || (playout == 1) || (apiAds == 1)) player.ima.initializeAdDisplayContainer(); }); }

        var contentPlayer = document.getElementById('rudo-video_html5_api');
        if ((isIOS || isAndroid) && contentPlayer.hasAttribute('controls')) contentPlayer.removeAttribute('controls');

        addGifInPlayer();
        $video.after($('.rudo-title').clone());
        $jsPlays = $('.js-plays');
        $loadingSpinner = $('.vjs-loading-spinner');
        $settingList = $('.vjs-settings-list');
        if (customBranding == 1) addRudoIcon();
        initCustomRightClick();
        player.volume(streamVolume);
        $('#notification').appendTo('.video-js');
        $('.controls-banner').appendTo('.video-js');
        api = document.getElementById('rudo-video_html5_api');
        $('.tap-button').appendTo('body');

        if (player.muted()) $('html').addClass('player-has-muted');

        var $cogMenu = $('.vjs-control.vjs-button.vjs-cog-menu-button').find('.vjs-menu-settings');
        $cogMenu.attr('tabindex', '0');
        applyTextTrackSettings(player);

        if (isIOS) {
            // --- iOS CEA-608 Subtitle Fix ---
            // iOS auto-enables CEA-608 in-band captions and touching track.mode via JS
            // triggers a Safari bug that forces them back on. Solution: use CSS-only
            // hiding with a toggleable class, controlled by the Video.js CC button.
            if (!document.getElementById('ios-cc-toggle-style')) {
                var ccStyle = document.createElement('style');
                ccStyle.id = 'ios-cc-toggle-style';
                ccStyle.innerHTML = '.ios-cc-hidden .vjs-text-track-display,' +
                    '.ios-cc-hidden video::-webkit-media-text-track-container,' +
                    '.ios-cc-hidden video::-webkit-media-text-track-display {' +
                    '  display: none !important; opacity: 0 !important;' +
                    '  visibility: hidden !important; pointer-events: none !important; }';
                document.head.appendChild(ccStyle);
            }

            // Start with subtitles hidden
            var playerEl = player.el();
            if (playerEl) playerEl.classList.add('ios-cc-hidden');

            // Toggle subtitles via CC button click (never touch track.mode)
            var ccBtn = playerEl ? playerEl.querySelector('.vjs-subs-caps-button') : null;
            if (ccBtn) {
                ccBtn.addEventListener('click', function () {
                    setTimeout(function () {
                        var tracks = player.textTracks();
                        var anyShowing = false;
                        for (var t = 0; t < tracks.length; t++) {
                            if ((tracks[t].kind === 'captions' || tracks[t].kind === 'subtitles') && tracks[t].mode === 'showing') {
                                anyShowing = true; break;
                            }
                        }
                        if (anyShowing) {
                            playerEl.classList.remove('ios-cc-hidden');
                        } else {
                            playerEl.classList.add('ios-cc-hidden');
                        }
                    }, 100);
                });
            }

            // Also listen for track changes from native fullscreen menu
            player.textTracks().on('change', function () {
                var tracks = player.textTracks();
                var anyShowing = false;
                for (var t = 0; t < tracks.length; t++) {
                    if ((tracks[t].kind === 'captions' || tracks[t].kind === 'subtitles') && tracks[t].mode === 'showing') {
                        anyShowing = true; break;
                    }
                }
                if (anyShowing) {
                    playerEl.classList.remove('ios-cc-hidden');
                } else {
                    playerEl.classList.add('ios-cc-hidden');
                }
            });
        }
    });

    function checkTransitionToDAI() {
        if (typeof DAI !== 'undefined' && DAI === 1 && !window.__daiTransitioned) {
            window.__daiTransitioned = true;

            if (player) {
                // --- Reuse player for DAI (no dispose = preserves user gesture) ---

                // 1. Hide IMA CSAI ad container
                try {
                    var imaContainer = document.getElementById('rudo-video_ima-ad-container');
                    if (imaContainer) imaContainer.style.display = 'none';
                } catch(e) {}

                // 2. Transfer player identity
                playerDAI = player;
                player = null;
                playerVersion = 'playerDAI';
                currentPlayer = playerDAI;

                // 3. Preserve mute state from preroll interaction
                playerDAI.muted(lastMutedDAIStatus);
                if (lastMutedDAIStatus === false) {
                    playerDAI.volume(streamVolume || 0.7);
                }

                // 4. DV source interceptor for DAI URLs
                if (typeof DV !== 'undefined' && DV == 2 && !playerDAI.__daiSrcIntercepted) {
                    try {
                        var originalSrc = playerDAI.src.bind(playerDAI);
                        playerDAI.src = function (source) {
                            if (source && typeof source.src === 'string' && source.src.indexOf('dai.google.com') > -1) {
                                source.src = source.src.replace('https://dai.google.com', 'https://redirector.dps.live/hls-video-gdai/' + slug);
                                source.src = source.src + '?dpssid=' + _dpssid + '&sid=' + _sid + '&ndvc=' + _ndvc;
                            }
                            return originalSrc(source);
                        };
                        playerDAI.__daiSrcIntercepted = true;
                    } catch (e) { console.warn('Interceptor DV error:', e); }
                }

                // 5. DAI ad event handler
                var onAdEvent = function (event) {
                    if (event.type == google.ima.dai.api.StreamEvent.Type.LOADED) {
                        var adUI = document.getElementById('ad-ui');
                        if (adUI) { adUI.style.display = 'none'; adUI.style.width = '100%'; adUI.style.position = 'absolute'; adUI.style.left = '0px'; adUI.style.top = '0px'; adUI.style.backgroundImage = 'url("https://rudo.video/mas-informacion.png")'; adUI.style.backgroundRepeat = 'no-repeat'; adUI.style.backgroundPosition = 'right 0px top 32px'; }
                    }
                };

                playerDAI.on('stream-manager', function (response) {
                    var events = Object.values(google.ima.dai.api.StreamEvent.Type);
                    events.forEach(function(evt) { response.StreamManager.addEventListener(evt, onAdEvent); });
                });

                // 6. Initialize DAI plugin on the SAME player
                if (!playerDAI.__timeLimitExceeded) {
                    // Fix: CSAI ima() already converted player.ads from function to object.
                    // imaDai() expects ads to be callable. Wrap it without losing state.
                    if (playerDAI.ads && typeof playerDAI.ads !== 'function') {
                        var _adsState = playerDAI.ads;
                        var _adsProxy = function() { return _adsState; };
                        for (var k in _adsState) {
                            try { _adsProxy[k] = _adsState[k]; } catch(e) {}
                        }
                        playerDAI.ads = _adsProxy;
                    }

                    // Fix: IMA DAI SDK resets currentTime to 0 on playback start.
                    // The DAI stream is an EVENT playlist (full history available).
                    // We must seek to live edge immediately on first play.
                    playerDAI.one('playing', function () {
                        if (streamType == 'live') {
                            var seekable = playerDAI.seekable();
                            if (seekable.length > 0) {
                                var edge = seekable.end(seekable.length - 1);
                                if (edge - playerDAI.currentTime() > 10) {
                                    playerDAI.currentTime(edge - 2);
                                }
                            }
                        }
                    });

                    // Clear old CSAI source — imaDai expects a clean player
                    playerDAI.pause();
                    try { playerDAI.src(''); } catch(e) {}
                    playerDAI.autoplay(true);

                    var imaOptions; var streamRef = null;
                    if (typeof window.videojsIma !== 'undefined' && window.videojsIma.LiveStream && typeof ASK !== 'undefined') {
                        streamRef = new window.videojsIma.LiveStream('hls', ASK);
                    }

                    if (typeof DAITK !== 'undefined' && DAITK != 0) {
                        imaOptions = { fallbackStreamUrl: 'http://storage.googleapis.com/testtopbox-public/video_content/bbb/master.m3u8', authToken: (typeof window.authToken !== 'undefined' ? window.authToken : null) };
                    } else {
                        imaOptions = { autoPlayAdBreaks: true, fallbackStreamUrl: 'http://storage.googleapis.com/testtopbox-public/video_content/bbb/master.m3u8' };
                    }

                    try { playerDAI.imaDai(streamRef, imaOptions); playerDAI.__imaDaiStarted = true; } catch (e) { console.warn('[DAI] imaDai init error:', e); }
                }
            }
        } else {
            if (window._debounceDAI) clearTimeout(window._debounceDAI);
            console.log('[DEBUG] checkTransitionToDAI: Debouncing playPromiseSafe(player)');
            window._debounceDAI = setTimeout(function () { playPromiseSafe(player); }, 300);
        }
    }

    if (haveAds == 1 || playout == 1 || apiAds == 1) {
        player.on('adsready', function () {
            AdsExist = true; imaADS = 1;
            var imaEvents = [
                { type: google.ima.AdEvent.Type.AD_BUFFERING, action: hidePoster },
                { type: google.ima.AdEvent.Type.AD_PROGRESS, action: hidePoster },
                { type: google.ima.AdEvent.Type.SKIPPED, action: function () { showPoster(); checkTransitionToDAI(); } },
                { type: google.ima.AdEvent.Type.COMPLETE, action: function () { showPoster(); } },
                { type: google.ima.AdEvent.Type.ALL_ADS_COMPLETED, action: function () { checkTransitionToDAI(); } }
            ];

            imaEvents.forEach(function (evt) { player.ima.addEventListener(evt.type, function () { if (evt.action) evt.action(); }); });

            player.ima.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, function () {
                console.log('[DEBUG] CONTENT_RESUME_REQUESTED disparado');
                if ((isEdge || isSafari) && (streamType == 'live')) player.src({ src: streamURL, type: typeStreamURL });
                if (player.muted() === false) player.volume(streamVolume);

                if (typeof DAI !== 'undefined' && DAI === 1) { 
                    console.log('[DEBUG] CONTENT_RESUME_REQUESTED -> checkTransitionToDAI() [DAI]');
                    checkTransitionToDAI(); 
                }
                else if (isNaN(player.duration()) || player.currentTime() < player.duration() || streamType == 'live') { 
                    console.log('[DEBUG] CONTENT_RESUME_REQUESTED -> playPromiseSafe(player) [CSAI]');
                    playPromiseSafe(player); 
                }
                showPoster();
            });
        });

        player.on('readyforpreroll', function () { if (isIOS) $loadingSpinner.addClass('vjs-block'); $loadingSpinner.css({ 'opacity': '1' }); adCurrent = true; });
        player.on('ads-ad-started', function () { $loadingSpinner.removeClass('vjs-block'); hidePoster(); adCurrent = true; });
        player.on('nopreroll', function () { showPoster(); checkTransitionToDAI(); });
        player.on('adscanceled', function () { showPoster(); adCurrent = false; checkTransitionToDAI(); });
        player.on('adtimeout', function () { $loadingSpinner.removeClass('vjs-block'); checkTransitionToDAI(); });
        player.on('adserror', function (e) { $loadingSpinner.removeClass('vjs-block'); showPoster(); adCurrent = false; if (autoplayPlayer) checkTransitionToDAI(); });
        player.on('adend', function () { if (isIOS) $loadingSpinner.removeClass('vjs-block'); hidePoster(); adCurrent = false; });
        player.on('adskip', function () { hidePoster(); });
    }

    player.one('play', function (e) {
        if (streamType == 'live') countPlusLive();
        api = document.getElementById('rudo-video_html5_api');
        api.onvolumechange = function () { if (api.getAttribute('muted') !== null) { $('html').addClass('player-has-muted'); } else { $('html').removeClass('player-has-muted'); } };
    });
    player.on('playing', function () { $loadingSpinner.removeClass('vjs-block'); if (isIOS) $loadingSpinner.css({ 'opacity': '0' }); });
    player.on('play', function () {
        let tracks = player.textTracks(); let segmentMetadataTrack;
        for (let i = 0; i < tracks.length; i++) { if (tracks[i].label === 'segment-metadata') segmentMetadataTrack = tracks[i]; }
        if (segmentMetadataTrack) {
            segmentMetadataTrack.on('cuechange', function () {
                let activeCue = segmentMetadataTrack.activeCues[0];
                if (activeCue) {
                    var segment = get_current_segment_info(player); dataSegmenter = segment.title;
                    if ((typeof dataSegmenter !== 'undefined') && (adCurrent == false)) {
                        var adsValues = dataSegmenter.split('|'); var adsURLManifest = adsValues[2];
                        if (typeof adsURLManifest !== 'undefined') { player.ima.changeAdTag(adsURLManifest); player.ima.requestAds(); adCurrent = true; player.play(); dataSegmenterB = dataSegmenter; }
                    }
                }
            });
        }
    });
    player.one('loadeddata', function () {
        if (fastDVRSeek) {
            player.currentTime(fastDVRSeek);
            player.volume(0.5);
        }
    });
    if (haveAds == 0 && (typeof DAI === 'undefined' || DAI == 0) && !player.__timeLimitExceeded && streamAutoplay == 1) { playPromiseSafe(player); }
}

function buildDAIPlayer() {
    playerVersion = 'playerDAI';
    if (window.__daiTransitioned) {
        $("#afterPlayer").prepend(videoElement);
    }

    var rawVideo = document.getElementById('rudo-video');
    if (rawVideo && isIOS) {
        rawVideo.setAttribute('playsinline', 'playsinline');
        rawVideo.setAttribute('webkit-playsinline', 'webkit-playsinline');
    }

    var vjsOptionsDAI = {
        responsive: true, crossorigin: 'anonymous', errorDisplay: false, liveui: liveUiDVR,
        playsinline: true,
        autoplay: (isAndroid || isIOS) ? true : autoplayPlayer,
        muted: (isAndroid || isIOS) ? true : lastMutedDAIStatus,
        preload: preloadPlayer, loop: loopPlayer,
    };

    playerDAI = videojs('rudo-video', vjsOptionsDAI);
    playerDAI.nuevo({ relatedMenu: false, shareMenu: false, errordisplay: false, resOnly: true });
    setupManualTimeLimit(playerDAI);
    currentPlayer = playerDAI;
    playerDAI.chromecast({ appId: '94369AED', button: 'controlbar', metatitle: titleVideo, metasubtitle: videoAuthor });

    if (typeof DV !== 'undefined' && DV == 2 && window.playerDAI && !playerDAI.__daiSrcIntercepted) {
        try {
            var originalSrc = playerDAI.src.bind(playerDAI);
            playerDAI.src = function (source) {
                if (source && typeof source.src === 'string' && source.src.indexOf('dai.google.com') > -1) {
                    source.src = source.src.replace('https://dai.google.com', 'https://redirector.dps.live/hls-video-gdai/' + slug);
                    source.src = source.src + '?dpssid=' + _dpssid + '&sid=' + _sid + '&ndvc=' + _ndvc;
                }
                return originalSrc(source);
            };
            playerDAI.__daiSrcIntercepted = true;
        } catch (e) { console.warn('Interceptor DV error:', e); }
    }

    const onAdEvent = function (event) {
        if (event.type == google.ima.dai.api.StreamEvent.Type.LOADED) {
            var adUI = document.getElementById("ad-ui");
            if (adUI) { adUI.style.display = 'none'; adUI.style.width = '100%'; adUI.style.position = 'absolute'; adUI.style.left = '0px'; adUI.style.top = '0px'; adUI.style.backgroundImage = 'url("https://rudo.video/mas-informacion.png")'; adUI.style.backgroundRepeat = 'no-repeat'; adUI.style.backgroundPosition = 'right 0px top 32px'; }
        }
    };

    playerDAI.on('stream-manager', (response) => {
        const events = Object.values(google.ima.dai.api.StreamEvent.Type);
        events.forEach(evt => response.StreamManager.addEventListener(evt, onAdEvent.bind(this)));
    });

    if (!playerDAI.__imaDaiStarted && !playerDAI.__timeLimitExceeded) {
        var imaOptions; var streamRef = null;
        if (typeof window.videojsIma !== 'undefined' && window.videojsIma.LiveStream && typeof ASK !== 'undefined') { streamRef = new window.videojsIma.LiveStream('hls', ASK); }

        if (typeof DAITK !== 'undefined' && DAITK != 0) {
            imaOptions = { fallbackStreamUrl: "http://storage.googleapis.com/testtopbox-public/video_content/bbb/master.m3u8", authToken: (typeof window.authToken !== 'undefined' ? window.authToken : null) };
        } else {
            imaOptions = { autoPlayAdBreaks: true, fallbackStreamUrl: "http://storage.googleapis.com/testtopbox-public/video_content/bbb/master.m3u8" };
        }

        try { playerDAI.imaDai(streamRef, imaOptions); playerDAI.__imaDaiStarted = true; } catch (e) { }
    }

    playerDAI.on('ready', function () {
        addGifInPlayer();
        $video.after($('.rudo-title').clone());
        $jsPlays = $('.js-plays');
        $loadingSpinner = $('.vjs-loading-spinner');
        $settingList = $('.vjs-settings-list');
        if (customBranding == 1) addRudoIcon();
        initCustomRightClick();
        $('#notification').appendTo('.video-js');
        $('.controls-banner').appendTo('.video-js');
        api = document.getElementById('rudo-video_html5_api');
        $('.tap-button').appendTo('body');

        if (playerDAI.muted()) $('html').addClass('player-has-muted');

        var $cogMenu = $('.vjs-control.vjs-button.vjs-cog-menu-button').find('.vjs-menu-settings');
        $cogMenu.attr('tabindex', '0');
        applyTextTrackSettings(playerDAI);

        if (isIOS) {
            // --- iOS CEA-608 Subtitle Fix (DAI) ---
            if (!document.getElementById('ios-cc-toggle-style')) {
                var ccStyleDAI = document.createElement('style');
                ccStyleDAI.id = 'ios-cc-toggle-style';
                ccStyleDAI.innerHTML = '.ios-cc-hidden .vjs-text-track-display,' +
                    '.ios-cc-hidden video::-webkit-media-text-track-container,' +
                    '.ios-cc-hidden video::-webkit-media-text-track-display {' +
                    '  display: none !important; opacity: 0 !important;' +
                    '  visibility: hidden !important; pointer-events: none !important; }';
                document.head.appendChild(ccStyleDAI);
            }

            var playerElDAI = playerDAI.el();
            if (playerElDAI) playerElDAI.classList.add('ios-cc-hidden');

            var ccBtnDAI = playerElDAI ? playerElDAI.querySelector('.vjs-subs-caps-button') : null;
            if (ccBtnDAI) {
                ccBtnDAI.addEventListener('click', function () {
                    setTimeout(function () {
                        var tracks = playerDAI.textTracks();
                        var anyShowing = false;
                        for (var t = 0; t < tracks.length; t++) {
                            if ((tracks[t].kind === 'captions' || tracks[t].kind === 'subtitles') && tracks[t].mode === 'showing') {
                                anyShowing = true; break;
                            }
                        }
                        if (anyShowing) {
                            playerElDAI.classList.remove('ios-cc-hidden');
                        } else {
                            playerElDAI.classList.add('ios-cc-hidden');
                        }
                    }, 100);
                });
            }

            playerDAI.textTracks().on('change', function () {
                var tracks = playerDAI.textTracks();
                var anyShowing = false;
                for (var t = 0; t < tracks.length; t++) {
                    if ((tracks[t].kind === 'captions' || tracks[t].kind === 'subtitles') && tracks[t].mode === 'showing') {
                        anyShowing = true; break;
                    }
                }
                if (anyShowing) {
                    playerElDAI.classList.remove('ios-cc-hidden');
                } else {
                    playerElDAI.classList.add('ios-cc-hidden');
                }
            });
        }
    });

    playerDAI.one('play', function (e) {
        if (streamType == 'live') countPlusLive();
        api = document.getElementById('rudo-video_html5_api');
        api.onvolumechange = function () { if (api.getAttribute('muted') !== null) { $('html').addClass('player-has-muted'); } else { $('html').removeClass('player-has-muted'); } };
    });

    if (!playerDAI.__timeLimitExceeded && !window.__daiTransitioned) playPromiseSafe(playerDAI);
}

function initVideoPlayer() {
    var enrutarReproductor = function () {
        if (typeof dpsssai !== 'undefined' && dpsssai == 1) { buildPlayer(); }
        else if (haveAds == 1 && typeof DAI !== 'undefined' && DAI == 1) { buildPlayer(); }
        else if (haveAds == 0 && typeof DAI !== 'undefined' && DAI == 1) { buildDAIPlayer(); }
        else { buildPlayer(); }
    };

    if (typeof DAITK !== 'undefined' && DAITK == 1 && typeof tokenApiUrl !== 'undefined' && tokenApiUrl !== '') {
        $.ajax({
            url: tokenApiUrl, type: "GET", dataType: "json",
            success: function (response) {
                if (response && response.data && response.data.authToken) {
                    window.authToken = response.data.authToken;
                    if (typeof streamURL !== 'undefined') { streamURL = streamURL + "?auth-token=" + window.authToken; }
                }
                enrutarReproductor();
            },
            error: function () { enrutarReproductor(); }
        });
    } else { enrutarReproductor(); }
}

function isIphone() { return videojs.browser.IS_IOS || /iPhone/.test(navigator.userAgent); }

/*$(document).on('click', '.ima-mute-div, .tap-button', function (e) {
    const isPlayerPlayingWithAds = document.querySelector('.vjs-ad-playing.vjs-playing');
    var activePlayer = (playerVersion === "playerDAI" && window.playerDAI) ? playerDAI : player;

    if (isPlayerPlayingWithAds && !isIphone()) if (activePlayer) activePlayer.pause();

    if ($(this).hasClass('tap-button')) {
        $('.vjs-mute-control').trigger('click');
        if (AdsExist) $('.ima-muted').trigger('click');
    }

    if (activePlayer && activePlayer.muted() === false) { lastMutedDAIStatus = false; streamVolume = 0.7; }
    else { lastMutedDAIStatus = true; }
});

$(document).on('click', '#rudo-video_ima-mute-div', function (e) {
    var activePlayer = (playerVersion === "playerDAI" && window.playerDAI) ? playerDAI : player;
    if (activePlayer && activePlayer.muted() === false) { lastMutedDAIStatus = false; streamVolume = 0.7; }
    else { lastMutedDAIStatus = true; }
});*/

$(document).on('click', '.ima-mute-div, .tap-button, #rudo-video_ima-mute-div', function (e) {
    e.stopImmediatePropagation();
    const isPlayerPlayingWithAds = document.querySelector('.vjs-ad-playing.vjs-playing');
    var activePlayer = (playerVersion === "playerDAI" && window.playerDAI) ? playerDAI : player;

    if (isPlayerPlayingWithAds && !isIphone()) if (activePlayer) activePlayer.pause();

    if ($(this).hasClass('tap-button')) {
        $('.vjs-mute-control').trigger('click');
        if (AdsExist) $('.ima-muted').trigger('click');

        if (activePlayer) {
            activePlayer.muted(false);
            activePlayer.volume(0.7);
        }
        lastMutedDAIStatus = false;
        streamVolume = 0.7;
    } else {
        if (lastMutedDAIStatus === true) {
            lastMutedDAIStatus = false;
            streamVolume = 0.7;
            if (activePlayer) { activePlayer.muted(false); activePlayer.volume(0.7); }
        } else {
            lastMutedDAIStatus = true;
            if (activePlayer) activePlayer.muted(true);
        }
    }
});

// Sincronizamos la variable global cuando el usuario mutee manualmente fuera de un anuncio,
// previniendo que se pierda su configuración en futuros mid-rolls.
$(document).on('click', '.vjs-mute-control, .vjs-volume-bar', function (e) {
    if (!document.querySelector('.vjs-ad-playing')) {
        setTimeout(function () {
            var activePlayer = (playerVersion === "playerDAI" && window.playerDAI) ? playerDAI : player;
            if (activePlayer) {
                lastMutedDAIStatus = activePlayer.muted();
                if (!lastMutedDAIStatus) streamVolume = activePlayer.volume();
            }
        }, 100);
    }
});

window.addEventListener('message', function (event) {
    if (~event.origin.indexOf('')) {
        var msg = event.data;
        var activePlayer = (playerVersion === "playerDAI" && window.playerDAI) ? playerDAI : player;
        if (activePlayer) {
            if (msg == 'start') activePlayer.play();
            if (msg == 'stop') activePlayer.pause();
            if (msg == 'mute') activePlayer.muted(true);
            if (msg == 'unmute') activePlayer.muted(false);
        }
    }
});

function countPlus() { if (!$jsPlays[0]) return false; $.getJSON('https://count-us.rudo.video/api3/countvideo/' + slug + '?callback=?', function (data) { $jsPlays.html(data.total); }); }
function countPlusLive() { $.getJSON('https://count-us.rudo.video/api3/countlive/' + slug + '?callback=?', function (data) { }); }
function getPlays() { if (!$jsPlays[0]) return false; $.getJSON('https://count-us.rudo.video/api3/getplays/' + slug + '?callback=?', function (data) { $jsPlays.html(data.total); }); }

function setupManualTimeLimit(activePlayer) {
    if (typeof limitTime === 'undefined' || limitTime == 0) return;

    var limitInSeconds = limitTime;
    var watchedSeconds = 0;
    var timeLimitReached = false;
    var storageKeyTime = 'rudo_limit_time_' + slug;
    var storageKeyDate = 'rudo_limit_date_' + slug;

    if (typeof limitWindowTime !== 'undefined' && limitWindowTime > 0) {
        var savedDate = localStorage.getItem(storageKeyDate);
        if (savedDate) {
            var now = new Date().getTime();
            var elapsed = now - parseInt(savedDate, 10);
            if (elapsed > (limitWindowTime * 1000)) {
                localStorage.removeItem(storageKeyTime);
                localStorage.removeItem(storageKeyDate);
            }
        }
    }

    var savedTime = localStorage.getItem(storageKeyTime);
    if (savedTime) {
        watchedSeconds = parseInt(savedTime, 10);
    }

    if (watchedSeconds >= limitInSeconds) {
        activePlayer.__timeLimitExceeded = true;
        triggerTimeLimitAction(activePlayer);
        return;
    }

    var progressBarContainer = document.createElement('div');
    progressBarContainer.className = 'rudo-limit-progress-container';
    progressBarContainer.style.position = 'absolute';
    progressBarContainer.style.top = '0';
    progressBarContainer.style.left = '0';
    progressBarContainer.style.width = '100%';
    progressBarContainer.style.height = '2px';
    progressBarContainer.style.background = 'rgba(255, 255, 255, 0.3)';
    progressBarContainer.style.zIndex = '9999';
    progressBarContainer.style.pointerEvents = 'none';

    var progressBar = document.createElement('div');
    progressBar.style.height = '100%';
    progressBar.style.width = '100%';
    progressBar.style.background = '#e50914';
    progressBar.style.transition = 'width 1s linear';

    progressBarContainer.appendChild(progressBar);

    var playerEl = activePlayer.el() || document.querySelector('.video-js');
    if (playerEl) {
        playerEl.appendChild(progressBarContainer);
    }

    function updateDisplay(remaining) {
        if (remaining < 0) remaining = 0;
        var percentage = (remaining / limitInSeconds) * 100;
        progressBar.style.width = percentage + '%';
    }

    updateDisplay(limitInSeconds - watchedSeconds);

    var limitInterval = setInterval(function () {
        if (activePlayer && !activePlayer.paused() && !activePlayer.seeking() && !timeLimitReached) {
            watchedSeconds++;

            localStorage.setItem(storageKeyTime, watchedSeconds);
            if (!localStorage.getItem(storageKeyDate)) {
                localStorage.setItem(storageKeyDate, new Date().getTime());
            }

            var remaining = limitInSeconds - watchedSeconds;
            updateDisplay(remaining);

            if (watchedSeconds >= limitInSeconds) {
                timeLimitReached = true;
                clearInterval(limitInterval);
                setTimeout(function () {
                    if (progressBarContainer.parentNode) {
                        progressBarContainer.parentNode.removeChild(progressBarContainer);
                    }
                    triggerTimeLimitAction(activePlayer);
                }, 1000);
            }
        }
    }, 1000);
}

function triggerTimeLimitAction(activePlayer) {
    if (activePlayer) {
        activePlayer.pause();
        activePlayer.src('');
        activePlayer.controls(false);
        activePlayer.removeClass('vjs-waiting');
    }

    var tapBtn = document.querySelector('.tap-button');
    if (tapBtn) tapBtn.style.display = 'none';

    if (!document.getElementById('rudo-limit-style')) {
        var style = document.createElement('style');
        style.id = 'rudo-limit-style';
        style.innerHTML = 'body.rudo-limit-exceeded .vjs-loading-spinner, body.rudo-limit-exceeded .vjs-big-play-button, body.rudo-limit-exceeded .vjs-control-bar, body.rudo-limit-exceeded .rudo-gif, body.rudo-limit-exceeded video { display: none !important; opacity: 0 !important; visibility: hidden !important; }';
        document.head.appendChild(style);
    }

    var limitURLC = typeof limitURL !== 'undefined' ? limitURL : "//digitalproserver.com";
    var limitTextC = typeof limitText !== 'undefined' ? limitText : "Has alcanzado el límite de tiempo de reproducción.";

    var overlayHtml = '<div id="rudo-timelimit-overlay" style="position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); z-index:9999; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#fff; font-family:sans-serif; padding:20px; box-sizing:border-box;">' +
        '<h2 style="font-size:22px; margin:0 0 20px 0;">' + limitTextC + '</h2>' +
        '<a href="' + limitURLC + '" target="_blank" style="background:#e50914; color:#fff; padding:12px 24px; text-decoration:none; font-size:16px; border-radius:4px; font-weight:bold; cursor:pointer;">Más información</a>' +
        '</div>';

    var playerContainer = document.querySelector('.video-js');
    if (playerContainer) {
        document.body.classList.add('rudo-limit-exceeded');
        playerContainer.insertAdjacentHTML('beforeend', overlayHtml);
    }

    if (activePlayer) {
        activePlayer.on('play', function () {
            activePlayer.pause();
        });
    }
}

initVideoPlayer();