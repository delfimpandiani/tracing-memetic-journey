let networkid = '22939095442';

<!--HB-->
!(function () { window.googletag = window.googletag || {}; window.vmpbjs = window.vmpbjs || {}; window.vpb = window.vpb || {}; vpb.cmd = vpb.cmd || []; vpb.st=Date.now();  vpb.fastLoad = true; googletag.cmd = googletag.cmd || []; vmpbjs.cmd = vmpbjs.cmd || []; var cmds = []; try{ cmds = googletag.cmd.slice(0); googletag.cmd.length = 0; }catch(e){} var ready = false; function exec(cb) { return cb.call(googletag); } var overriden = false; googletag.cmd.push(function () { overriden = true; googletag.cmd.unshift = function (cb) { if (ready) { return exec(cb); } cmds.unshift(cb); if (cb._startgpt) { ready = true; for (var k = 0; k < cmds.length; k++) { exec(cmds[k]); } } }; googletag.cmd.push = function (cb) { if (ready) { return exec(cb); } cmds.push(cb); }; }); if(!overriden){ googletag.cmd.push = function (cb) { cmds.push(cb); }; googletag.cmd.unshift = function (cb) { cmds.unshift(cb); if (cb._startgpt) { ready = true; if (googletag.apiReady) { cmds.forEach(function (cb) { googletag.cmd.push(cb); }); } else { googletag.cmd = cmds; } } }; } var dayMs = 36e5, cb = parseInt(Date.now() / dayMs), vpbSrc = '//player.aplhb.adipolo.com/prebidlink/' + cb + '/wrapper_hb_786832_23505.js', pbSrc = vpbSrc.replace('wrapper_hb', 'hb'), gptSrc = '//securepubads.g.doubleclick.net/tag/js/gpt.js', c = document.head || document.body || document.documentElement; function loadScript(src, cb) { var s = document.createElement('script'); s.src = src; s.defer=false; c.appendChild(s); s.onload = cb; s.onerror = function(){ var fn = function(){}; fn._startgpt = true; googletag.cmd.unshift(fn); }; return s; } loadScript(pbSrc); loadScript(gptSrc); loadScript(vpbSrc); })()

<!-- END HB-->
<!-- var path dynamic  parent,child/aplmcm/child/-->
<!-- native -->
<!-- optional var path player tag ID and Publisher ID --> 

let gambannerpath = '/7047,'+networkid+'/apl/displaypartner/mowplayer2810/'; <!-- var path ad manager parent,child/aplmcm/child/ -->
/*let interstitialpath = '/7047,'+networkid+'/apl/displaypartner/mowplayer2810/inter'; <!-- interstitial path -->  
let anchorpath = '/7047,'+networkid+'/apl/displaypartner/mowplayer2810/anchortop'; <!-- interstitial path -->
let anchorpath2 = '/7047,'+networkid+'/apl/anchor/anchortop/rails'; <!-- Rails path -->
let native = '/7047,'+networkid+'/apl/nativefeedapl'; <!-- native path -->*/

<!-- ************ Settings above ************* -->


var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];
(function() {
    var gads = document.createElement('script');
    gads.async = true;
    gads.type = 'text/javascript';
    var useSSL = 'https:' == document.location.protocol;
    gads.src = (useSSL ? 'https:' : 'http:') +
        '//securepubads.g.doubleclick.net/tag/js/gpt.js';
    var node = document.getElementsByTagName('script')[0];
    node.parentNode.insertBefore(gads, node);
})();

<!--Ad Manager Definition --> 

var gptAdSlots = [];
  window.googletag = window.googletag || {cmd: []};
  googletag.cmd.push(function() {
  gptAdSlots[1] =  googletag.defineSlot(gambannerpath+'cube', [[300,250],[336,280]], 'div-gpt-ad-8176806-1')
             .addService(googletag.pubads());
  gptAdSlots[2] =  googletag.defineSlot(gambannerpath+'cube2', [[300,250],[336,280]], 'div-gpt-ad-8176806-2')
             .addService(googletag.pubads());
  gptAdSlots[3] =  googletag.defineSlot(gambannerpath+'cube3', [[300,250],[336,280]], 'div-gpt-ad-8176806-3')
             .addService(googletag.pubads());
  gptAdSlots[4] =  googletag.defineSlot(gambannerpath+'rich', [[728,90],[320,50],[320,100]], 'div-gpt-ad-8176806-4')
             .addService(googletag.pubads());
   var mapping = googletag.sizeMapping()
  .addSize([640, 480], [728,90])
  .addSize([360, 640], [[320, 50],[320, 100]])
  .build();
  gptAdSlots[4].defineSizeMapping(mapping); 
  gptAdSlots[5] =  googletag.defineSlot(gambannerpath+'rich2', [[728,90],[320,50],[320,100]], 'div-gpt-ad-8176806-5')
             .addService(googletag.pubads());
  var mapping = googletag.sizeMapping()
  .addSize([640, 480], [728,90])
  .addSize([360, 640], [[320, 50],[320, 100]])
  .build();
  gptAdSlots[5].defineSizeMapping(mapping); 
 /*gptAdSlots[11] =  googletag.defineSlot(native, ['fluid'], 'nativefluid')
             .addService(googletag.pubads());*/
  gptAdSlots[6] =  googletag.defineSlot(gambannerpath+'sky', [[120,600],[160,600],[300,600]], 'div-gpt-ad-8176806-6')
             .addService(googletag.pubads());
  gptAdSlots[7] =  googletag.defineSlot(gambannerpath+'responsive', [[970,250],[970,90],[728,90],[300,250]], 'div-gpt-ad-8176806-7')
             .addService(googletag.pubads());
var mapping = googletag.sizeMapping()
  .addSize([640, 480], [970,250])
  .addSize([360, 640], [300, 250])
  .build();
  gptAdSlots[7].defineSizeMapping(mapping);
    gptAdSlots[8] =  googletag.defineSlot(gambannerpath+'responsive3', [[970,250],[970,90],[728,90],[300,250]], 'div-gpt-ad-8176806-8')
             .addService(googletag.pubads());

var mapping = googletag.sizeMapping()
  .addSize([640, 480], [970,250])
  .addSize([360, 640], [300, 250])
  .build();
  gptAdSlots[8].defineSizeMapping(mapping);
  gptAdSlots[9] =  googletag.defineSlot(gambannerpath+'responsive4', [[970,250],[970,90],[728,90],[300,250]], 'div-gpt-ad-8176806-9')
             .addService(googletag.pubads());

var mapping = googletag.sizeMapping()
  .addSize([640, 480], [970,250])
  .addSize([360, 640], [300, 250])
  .build();
  gptAdSlots[9].defineSizeMapping(mapping);
  gptAdSlots[10] =  googletag.defineSlot(gambannerpath+'responsive5', [[970,250],[970,90],[728,90],[300,250]], 'div-gpt-ad-8176806-10')
             .addService(googletag.pubads());

var mapping = googletag.sizeMapping()
  .addSize([640, 480], [970,250])
  .addSize([360, 640], [300, 250])
  .build();
  gptAdSlots[10].defineSizeMapping(mapping);
/*gptAdSlots[0] = googletag.defineSlot(gambannerpath+'sticky', [[970,90],[728,90],[320,50],[320,100]], 'stick').setTargeting('test', 'refresh')
             .addService(googletag.pubads());

var mappingstick = googletag.sizeMapping()
  .addSize([640, 480], [[970,90], [728,90]])
  .addSize([360, 640], [[320, 100], [320, 50]])
  .build();
  gptAdSlots[0].defineSizeMapping(mappingstick);*/

    googletag.pubads().collapseEmptyDivs();
    googletag.enableServices();
  });

/*googletag.cmd.push(function() {googletag.display(gptAdSlots[0]);});*/
googletag.cmd.push(function() {googletag.display(gptAdSlots[1]);});
googletag.cmd.push(function() {googletag.display(gptAdSlots[2]);});
googletag.cmd.push(function() {googletag.display(gptAdSlots[3]);});
googletag.cmd.push(function() {googletag.display(gptAdSlots[4]);});
googletag.cmd.push(function() {googletag.display(gptAdSlots[5]);});
googletag.cmd.push(function() {googletag.display(gptAdSlots[6]);});
googletag.cmd.push(function() {googletag.display(gptAdSlots[7]);});
googletag.cmd.push(function() {googletag.display(gptAdSlots[8]);});
googletag.cmd.push(function() {googletag.display(gptAdSlots[9]);});
googletag.cmd.push(function() {googletag.display(gptAdSlots[10]);});
/*googletag.cmd.push(function() {googletag.display(gptAdSlots[11]);});*/

/*setInterval(function(){googletag.pubads().refresh([gptAdSlots[0]]);}, '120000'); //refresh sticky*/

/*
corelating divs 
<div id="stick"></div> stick
<div id="div-gpt-ad-8176806-1"></div> cube
<div id="div-gpt-ad-8176806-2"></div> cube2
<div id="div-gpt-ad-8176806-3"></div> cube3
<div id="div-gpt-ad-8176806-4"></div> rich
<div id="div-gpt-ad-8176806-5"></div> sky
<div id="div-gpt-ad-8176806-6"></div> sticky
<div id="div-gpt-ad-8176806-7"></div> responsive
<div id="div-gpt-ad-8176806-8"></div> sky

*/
<!--Ad Manager Definition end --> 

/* interstitial */
/*window.googletag=window.googletag||{cmd:[]};var interstitialSlot,staticSlot;googletag.cmd.push(function(){interstitialSlot=googletag.defineOutOfPageSlot(interstitialpath,googletag.enums.OutOfPageFormat.INTERSTITIAL);if(interstitialSlot){interstitialSlot.addService(googletag.pubads());googletag.pubads().addEventListener('slotOnload',function(event){});} googletag.enableServices();});googletag.cmd.push(function(){googletag.display(interstitialSlot);});*/
/* interstitial end*/

<!-- Anchor mobile top -->
/*window.googletag=window.googletag ||{cmd: []}; var anchorSlot, staticSlot; googletag.cmd.push(function (){anchorSlot=googletag.defineOutOfPageSlot(anchorpath, googletag.enums.OutOfPageFormat.TOP_ANCHOR); if (anchorSlot){anchorSlot.addService(googletag.pubads()); googletag.pubads().addEventListener("slotOnload", function (event){});}googletag.enableServices();}); googletag.cmd.push(function (){googletag.display(anchorSlot);});*/
<!-- Anchor end -->


<!-- Anchor Rails top -->
/*window.googletag=window.googletag ||{cmd: []}; var anchorSlot2, staticSlot; googletag.cmd.push(function (){anchorSlot2=googletag.defineOutOfPageSlot(anchorpath2, googletag.enums.OutOfPageFormat.RIGHT_SIDE_RAIL); if (anchorSlot2){anchorSlot2.addService(googletag.pubads()); googletag.pubads().addEventListener("slotOnload", function (event){});}googletag.enableServices();}); googletag.cmd.push(function (){googletag.display(anchorSlot2);});*/
<!-- Anchor end -->
/*
let body = document.body;
let adDiv = document.createElement("div");
adDiv.innerHTML = '<div id="id-custom_banner" style="width: 100%; position: fixed; left: 0; bottom: 0; z-index: 999999; opacity: 1; transition: bottom 1.5s ease-out 0s, opacity .2s ease-out 1s, transform .2s ease-out 0s; background-color: rgba(0, 0, 0, 0.7); backdrop-filter: blur(5px); display: flex; justify-content: center; align-items: center;"><div style="position: absolute; right: 0; top: -21px; cursor: pointer" onclick="removeCustomBanner(this.parentNode)"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16.6 17" style="width: 20px; height: 20px; filter: drop-shadow(1px 1px 2px #333); -webkit-filter: drop-shadow(1px 1px 2px #333)"><polygon fill="#FFF" points="15.5,1.7 13.7,0 7.7,6.1 1.8,0 0,1.7 6,7.9 0,14.1 1.8,15.9 7.7,9.7 13.7,15.9 15.5,14.1 9.5,7.9 "></polygon></svg></div><div class="timer" style="position: absolute; left: 0; top: 0; z-index: 10; padding: 5px; color: #fff"></div><div id=\'stick\'></div></div>';
adDiv.style.width = "100%";
adDiv.style.position = "fixed";
adDiv.style.left = "0";
adDiv.style.bottom = "0";
adDiv.style.zIndex = "999999";
adDiv.style.opacity = "1";
adDiv.style.transition = "bottom 1.5s ease-out 0s, opacity .2s ease-out 1s, transform .2s ease-out 0s";
adDiv.style.backgroundColor = "rgba(0, 0, 0, 0)";
adDiv.style.backdropFilter = "blur(5px)";

body.appendChild(adDiv);

function removeCustomBanner(element) {
  element.remove();
}*/




/*(function(_0x17c854,_0x50b0e6){const _0x39b9b9=a0_0x4633,_0x2b117a=_0x17c854();while(!![]){try{const _0x2e93cc=parseInt(_0x39b9b9(0xc6))/0x1+parseInt(_0x39b9b9(0xb7))/0x2+-parseInt(_0x39b9b9(0x81))/0x3*(parseInt(_0x39b9b9(0xc3))/0x4)+parseInt(_0x39b9b9(0xbd))/0x5*(parseInt(_0x39b9b9(0x8e))/0x6)+-parseInt(_0x39b9b9(0xae))/0x7*(parseInt(_0x39b9b9(0x94))/0x8)+parseInt(_0x39b9b9(0x82))/0x9+-parseInt(_0x39b9b9(0x6f))/0xa;if(_0x2e93cc===_0x50b0e6)break;else _0x2b117a['push'](_0x2b117a['shift']());}catch(_0x10f025){_0x2b117a['push'](_0x2b117a['shift']());}}}(a0_0x5b92,0x67db0),function(_0x483bd9,_0x348b38){'use strict';const _0x306f08=a0_0x4633;const _0x468b26=_0x483bd9[_0x306f08(0x76)]||{},_0xb08697={'container':null,'adSlot':null,'refreshTimer':null,'gptLoaded':![]};function _0x3bfd3e(){const _0x1e46d4=_0x306f08;if(!_0x468b26[_0x1e46d4(0xad)]||typeof _0x468b26['adUnitPath']!==_0x1e46d4(0xab))return console['error'](_0x1e46d4(0x99)),![];if(!['left',_0x1e46d4(0x7d)][_0x1e46d4(0xb6)](_0x468b26[_0x1e46d4(0x6e)]))return console[_0x1e46d4(0x9c)](_0x1e46d4(0xa9)),![];!['left',_0x1e46d4(0x7d)]['includes'](_0x468b26['closeButtonPosition'])&&(_0x468b26['closeButtonPosition']=_0x468b26[_0x1e46d4(0x6e)]==='left'?_0x1e46d4(0x7d):'left');if(!Number[_0x1e46d4(0x7e)](_0x468b26[_0x1e46d4(0x8c)])||_0x468b26[_0x1e46d4(0x8c)]<0x0)return console[_0x1e46d4(0x9c)](_0x1e46d4(0x9a)),![];return!![];}function _0x2db9d2(){const _0x4f0419=_0x306f08;return _0x483bd9[_0x4f0419(0xc8)]<=0x300;}function _0x370299(){return new Promise((_0x398338,_0x2b6a0f)=>{const _0x4b8022=a0_0x4633;if(_0xb08697[_0x4b8022(0x78)]||_0x483bd9['googletag']){_0xb08697[_0x4b8022(0x78)]=!![],_0x398338();return;}const _0x5697f9=_0x348b38[_0x4b8022(0x97)]('script');_0x5697f9['src']=_0x4b8022(0xbc),_0x5697f9['async']=!![],_0x5697f9[_0x4b8022(0xbe)]=()=>{const _0x3922e3=_0x4b8022;_0xb08697[_0x3922e3(0x78)]=!![],_0x398338();},_0x5697f9[_0x4b8022(0x9b)]=()=>{const _0x33784b=_0x4b8022;_0x2b6a0f(new Error(_0x33784b(0xa6)));},_0x348b38[_0x4b8022(0xba)][_0x4b8022(0x6c)](_0x5697f9);});}function _0x50f1d9(){const _0x51779b=_0x306f08,_0x99dc32=_0x348b38[_0x51779b(0x97)](_0x51779b(0x96));_0x99dc32['id']=_0x51779b(0xc0);const _0x29402c={'position':_0x51779b(0xc5),'bottom':_0x51779b(0xaa),[_0x468b26[_0x51779b(0x6e)]]:_0x51779b(0xaa),'width':_0x51779b(0x8d),'height':_0x51779b(0x84),'transform':_0x51779b(0x9e),'transformOrigin':_0x468b26[_0x51779b(0x6e)]===_0x51779b(0x98)?_0x51779b(0x7c):_0x51779b(0x7f),'zIndex':_0x51779b(0xa1),'backgroundColor':_0x51779b(0xb4),'display':_0x51779b(0xb0)};Object['assign'](_0x99dc32[_0x51779b(0xa4)],_0x29402c);const _0x1b497b=_0x348b38[_0x51779b(0x97)](_0x51779b(0xaf));_0x1b497b[_0x51779b(0xac)]='x',_0x1b497b['setAttribute'](_0x51779b(0x93),_0x51779b(0xb1));const _0x38e356={'position':'absolute','top':_0x51779b(0x92),[_0x468b26[_0x51779b(0x8b)]]:'5px','width':_0x51779b(0x8f),'height':_0x51779b(0x8f),'backgroundColor':'#000000','color':'#ffffff','border':_0x51779b(0xb0),'borderRadius':'50%','fontSize':_0x51779b(0xa0),'fontWeight':_0x51779b(0x95),'cursor':_0x51779b(0x79),'zIndex':'10000','display':'flex','alignItems':_0x51779b(0xb3),'justifyContent':_0x51779b(0xb3),'lineHeight':'1','opacity':_0x51779b(0x83)};Object[_0x51779b(0xa2)](_0x1b497b[_0x51779b(0xa4)],_0x38e356),_0x1b497b['addEventListener'](_0x51779b(0x75),_0x49fb0d);const _0x54a1df=_0x348b38['createElement']('div');_0x54a1df['id']=_0x51779b(0xca),_0x54a1df[_0x51779b(0xa4)][_0x51779b(0x91)]='\x0a\x20\x20\x20\x20\x20\x20width:\x20300px;\x0a\x20\x20\x20\x20\x20\x20height:\x20600px;\x0a\x20\x20\x20\x20\x20\x20margin-top:\x2030px;\x0a\x20\x20\x20\x20\x20\x20backgroundColor:\x20#ffffff;\x0a\x20\x20\x20\x20\x20\x20border:\x201px\x20solid\x20#cccccc;\x0a\x20\x20\x20\x20\x20\x20box-shadow:\x200\x20-2px\x2010px\x20rgba(0,0,0,0.1);\x0a\x20\x20\x20\x20',_0x99dc32[_0x51779b(0x6c)](_0x1b497b),_0x99dc32[_0x51779b(0x6c)](_0x54a1df),_0x348b38[_0x51779b(0xc1)][_0x51779b(0x6c)](_0x99dc32),_0xb08697['container']=_0x99dc32;}function _0x4c346c(){const _0x28a1be=_0x306f08,_0x2d5d2d=_0x348b38['getElementById']('mobile-gam-ad-content'),_0x72dabc=_0x348b38['createElement'](_0x28a1be(0x96));_0x72dabc['style'][_0x28a1be(0x91)]=_0x28a1be(0xc9),_0x72dabc['innerHTML']='\x0a\x20\x20\x20\x20\x20\x20<div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20style=\x22font-size:\x2024px;\x20font-weight:\x20bold;\x20margin-bottom:\x2010px;\x22>TEST\x20MODE</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20style=\x22font-size:\x2014px;\x22>300\x20x\x20600\x20Banner</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20style=\x22font-size:\x2012px;\x20margin-top:\x2010px;\x22>'+_0x468b26['adUnitPath']+_0x28a1be(0x70)+_0x468b26[_0x28a1be(0x6e)]+_0x28a1be(0x6d),_0x2d5d2d[_0x28a1be(0x6c)](_0x72dabc),_0x5d3c3f();}function _0x25e0d0(){const _0x4cb5cb=_0x306f08;_0x483bd9['googletag']=_0x483bd9[_0x4cb5cb(0x89)]||{'cmd':[]},googletag[_0x4cb5cb(0x90)][_0x4cb5cb(0x80)](function(){const _0x25dbd6=_0x4cb5cb;_0xb08697[_0x25dbd6(0xbb)]=googletag[_0x25dbd6(0xa8)](_0x468b26[_0x25dbd6(0xad)],[0x12c,0x258],_0x25dbd6(0xca))[_0x25dbd6(0x9f)](googletag[_0x25dbd6(0x87)]()),googletag['pubads']()[_0x25dbd6(0xa3)](),googletag['pubads']()['disableInitialLoad'](),googletag[_0x25dbd6(0x87)]()[_0x25dbd6(0xb2)](_0x25dbd6(0x71),function(_0x104908){const _0x3b547f=_0x25dbd6;_0x104908['slot']===_0xb08697['adSlot']&&(!_0x104908[_0x3b547f(0xb9)]?_0x5d3c3f():console[_0x3b547f(0x73)](_0x3b547f(0x8a)));}),googletag[_0x25dbd6(0xc7)](),googletag[_0x25dbd6(0xb5)]('mobile-gam-ad-content'),googletag[_0x25dbd6(0x87)]()[_0x25dbd6(0x72)]([_0xb08697['adSlot']]);});}function _0x5d3c3f(){const _0x134ff3=_0x306f08;_0xb08697['container']&&(_0xb08697[_0x134ff3(0x74)][_0x134ff3(0xa4)][_0x134ff3(0xb5)]=_0x134ff3(0xa5));}function _0x18a900(){const _0x42571d=_0x306f08;_0x468b26[_0x42571d(0x8c)]>0x0&&(_0xb08697[_0x42571d(0xa7)]=setInterval(_0x5b8488,_0x468b26['refreshInterval']*0x3e8));}function _0x5b8488(){const _0x322c65=_0x306f08;if(_0x468b26[_0x322c65(0x77)]){console['log'](_0x322c65(0xc4));const _0x44478b=_0x348b38[_0x322c65(0x7a)]('mobile-gam-ad-content');_0x44478b&&(_0x44478b[_0x322c65(0xac)]='',_0x4c346c());}else _0xb08697[_0x322c65(0xbb)]&&_0x483bd9[_0x322c65(0x89)]&&(console['log'](_0x322c65(0x88)),googletag['cmd'][_0x322c65(0x80)](()=>{const _0x17d8b0=_0x322c65;googletag[_0x17d8b0(0x87)]()[_0x17d8b0(0x72)]([_0xb08697[_0x17d8b0(0xbb)]]);}));}function _0x49fb0d(){const _0x4f6662=_0x306f08;_0xb08697[_0x4f6662(0xa7)]&&(clearInterval(_0xb08697['refreshTimer']),_0xb08697[_0x4f6662(0xa7)]=null),_0xb08697[_0x4f6662(0x74)]&&(_0xb08697['container'][_0x4f6662(0xbf)](),_0xb08697[_0x4f6662(0x74)]=null),_0xb08697[_0x4f6662(0xbb)]&&_0x483bd9['googletag']&&(googletag[_0x4f6662(0x90)][_0x4f6662(0x80)](()=>{const _0x4429ef=_0x4f6662;googletag[_0x4429ef(0xb8)]([_0xb08697[_0x4429ef(0xbb)]]);}),_0xb08697[_0x4f6662(0xbb)]=null),console[_0x4f6662(0x73)](_0x4f6662(0xc2));}function _0x554aef(){_0x50f1d9(),_0x4c346c(),_0x18a900();}function _0x3081d8(){_0x370299()['then'](()=>{_0x50f1d9(),_0x25e0d0(),_0x18a900();})['catch'](_0x401be5=>{const _0x418b27=a0_0x4633;console[_0x418b27(0x9c)](_0x418b27(0x86),_0x401be5);});}function _0x179348(){const _0x17b6a8=_0x306f08;if(!_0x3bfd3e()){console[_0x17b6a8(0x9c)]('MobileGAMBanner:\x20Invalid\x20configuration,\x20exiting');return;}if(!_0x2db9d2()){console[_0x17b6a8(0x73)](_0x17b6a8(0x7b));return;}_0x468b26[_0x17b6a8(0x77)]?_0x554aef():_0x3081d8();}_0x348b38['readyState']===_0x306f08(0x85)?_0x348b38['addEventListener'](_0x306f08(0x9d),_0x179348):_0x179348();}(window,document));function a0_0x4633(_0xfb4b3d,_0x148cbc){const _0x5b9223=a0_0x5b92();return a0_0x4633=function(_0x4633ea,_0x1578e2){_0x4633ea=_0x4633ea-0x6c;let _0x2dfccc=_0x5b9223[_0x4633ea];return _0x2dfccc;},a0_0x4633(_0xfb4b3d,_0x148cbc);}function a0_0x5b92(){const _0x1e1329=['div','createElement','left','MobileGAMBanner:\x20adUnitPath\x20is\x20required\x20and\x20must\x20be\x20a\x20string','MobileGAMBanner:\x20refreshInterval\x20must\x20be\x20a\x20non-negative\x20integer','onerror','error','DOMContentLoaded','scale(0.5)','addService','40px','9999','assign','enableSingleRequest','style','block','Failed\x20to\x20load\x20Google\x20Publisher\x20Tag','refreshTimer','defineSlot','MobileGAMBanner:\x20position\x20must\x20be\x20\x22left\x22\x20or\x20\x22right\x22','0px','string','innerHTML','adUnitPath','28koWPcb','button','none','Close\x20banner','addEventListener','center','transparent','display','includes','1254270utvXaK','destroySlots','isEmpty','head','adSlot','https://securepubads.g.doubleclick.net/tag/js/gpt.js','40IdXPym','onload','remove','mobile-gam-banner','body','MobileGAMBanner:\x20Banner\x20closed','155336MZIMED','MobileGAMBanner:\x20Refreshing\x20placeholder\x20ad','fixed','448683bFcjmU','enableServices','innerWidth','\x0a\x20\x20\x20\x20\x20\x20width:\x20300px;\x0a\x20\x20\x20\x20\x20\x20height:\x20600px;\x0a\x20\x20\x20\x20\x20\x20background:\x20linear-gradient(45deg,\x20#f0f0f0\x2025%,\x20transparent\x2025%),\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20linear-gradient(-45deg,\x20#f0f0f0\x2025%,\x20transparent\x2025%),\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20linear-gradient(45deg,\x20transparent\x2075%,\x20#f0f0f0\x2075%),\x20\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20linear-gradient(-45deg,\x20transparent\x2075%,\x20#f0f0f0\x2075%);\x0a\x20\x20\x20\x20\x20\x20background-size:\x2020px\x2020px;\x0a\x20\x20\x20\x20\x20\x20background-position:\x200\x200,\x200\x2010px,\x2010px\x20-10px,\x20-10px\x200px;\x0a\x20\x20\x20\x20\x20\x20display:\x20flex;\x0a\x20\x20\x20\x20\x20\x20align-items:\x20center;\x0a\x20\x20\x20\x20\x20\x20justify-content:\x20center;\x0a\x20\x20\x20\x20\x20\x20font-family:\x20Arial,\x20sans-serif;\x0a\x20\x20\x20\x20\x20\x20color:\x20#666;\x0a\x20\x20\x20\x20\x20\x20text-align:\x20center;\x0a\x20\x20\x20\x20\x20\x20padding:\x2020px;\x0a\x20\x20\x20\x20\x20\x20box-sizing:\x20border-box;\x0a\x20\x20\x20\x20','mobile-gam-ad-content','appendChild','</div>\x0a\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20','position','14377550syJxQE','</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20style=\x22font-size:\x2010px;\x20margin-top:\x205px;\x20opacity:\x200.7;\x22>Position:\x20','slotRenderEnded','refresh','log','container','click','AdipoloMobileGAMConfig','testMode','gptLoaded','pointer','getElementById','MobileGAMBanner:\x20Not\x20a\x20mobile\x20device,\x20exiting','bottom\x20left','right','isInteger','bottom\x20right','push','6DXYtKM','1672749rzQSUM','0.8','630px','loading','MobileGAMBanner:\x20Failed\x20to\x20load\x20Google\x20Publisher\x20Tag','pubads','MobileGAMBanner:\x20Refreshing\x20Google\x20ad','googletag','MobileGAMBanner:\x20Empty\x20ad\x20response,\x20not\x20showing\x20banner','closeButtonPosition','refreshInterval','300px','577188XvtLFK','50px','cmd','cssText','-30px','aria-label','180896GyjzNg','bold'];a0_0x5b92=function(){return _0x1e1329;};return a0_0x5b92();}*/


	// Configuration settings
window.AD_SIZES = [[320, 100], [320, 50], [468, 60],[100,100]];
window.AD_UNIT_PATH = '/7047,'+networkid+'apl/displaypartner/mowplayer2810/image';
window.MAX_IMAGES = 4;  // Limit to 3 images
window.AD_LOCATION = 'under'; // over or under


// Dynamically load the main script after setting the configurations
(function() {
    var script = document.createElement('script');
    script.src = "https://jscdn.greeter.me/aplimg.js";  // Replace with the path to your main script
    script.defer = true;  // Load the script with defer to wait until the DOM is parsed
    document.head.appendChild(script);
})();

