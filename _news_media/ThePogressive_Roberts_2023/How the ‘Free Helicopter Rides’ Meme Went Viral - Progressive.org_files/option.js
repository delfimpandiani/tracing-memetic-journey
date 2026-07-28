(() => {

  const moveChickletsToFooter = () => {
    const chicklets = document.querySelector("#logo .chicklets");
    const copyright = document.querySelector('#copyright');
    if (chicklets && copyright) {
      copyright.parentNode.insertBefore(chicklets, copyright);
    }
  };

  const addMoveListener = () => {
    moveChickletsToFooter();
  };

  const winLoad = callback => {
    if (document.readyState === "complete") {
      callback();
    } else {
      window.addEventListener("load", callback);
    }
  };

  winLoad(addMoveListener);
})();
(() => {
  const moveSearchBarToMainNav = () => {
    const mainNav = document.querySelector('#topnav .mainnav');
    const searchBar = document.getElementById('mp-search-bar')
      ? document.getElementById('mp-search-bar')
      : document.getElementById('CSE');

    // only move it if it's not there already
    if (searchBar && searchBar.parentElement !== mainNav) {
      mainNav.insertBefore(searchBar, mainNav.lastChild);
    }
  };

  const moveSearchBarBack = () => {
    const logo = document.querySelector('#logo');
    const searchBar = document.getElementById('mp-search-bar')
      ? document.getElementById('mp-search-bar')
      : document.getElementById('CSE');
    if (searchBar) {
      logo.insertBefore(searchBar, logo.firstChild);
    }
  };

  const checkMove = () => {
    const mql = window.matchMedia('(max-width: 48em)');
    if (mql.matches) {
      moveSearchBarToMainNav();
    } else {
      moveSearchBarBack();
    }
  };

  const foldSearchIntoNav = () => {
    window.addEventListener('resize', checkMove);
    checkMove();
  };

  const winLoad = (callback) => {
    if (document.readyState === 'complete') {
      callback();
    } else {
      window.addEventListener('load', callback);
    }
  };
  winLoad(foldSearchIntoNav);
})();
(() => {
  const registerFixedNav = () => {
    const nav = document.querySelector('#topnav');
    const topOfNav = nav.offsetTop;
    const mobileLogoLink = document.createElement('a');
    const logoToCopy = document.querySelector('link[rel="shortcut icon"]');

    const stickyLogo = document.createElement('img');
    stickyLogo.setAttribute('alt', 'Home');
    if (logoToCopy) {
      stickyLogo.setAttribute('src', logoToCopy.href);
      stickyLogo.setAttribute('width', 50);
      stickyLogo.setAttribute('height', 50);
      mobileLogoLink.append(stickyLogo);
    }
    mobileLogoLink.setAttribute('href', document.querySelector('#logo a[rel="home"]').href);
    mobileLogoLink.classList.add('mp-sticky-logo');
    // remove existing sticky logo
    const oldStickyLogo = nav.querySelector('a.mp-sticky-logo');
    if (oldStickyLogo) nav.removeChild(oldStickyLogo);
    nav.insertBefore(mobileLogoLink, nav.firstChild);

    const fixNav = () => {
      if (window.scrollY >= topOfNav) {
        nav.classList.add('fixed');
      } else {
        nav.classList.remove('fixed');
      }
    };
    window.addEventListener('scroll', fixNav);
  };

  const winLoad = (callback) => {
    if (document.readyState === 'complete') {
      callback();
    } else {
      window.addEventListener('load', callback);
    }
  };

  winLoad(registerFixedNav);
})();
