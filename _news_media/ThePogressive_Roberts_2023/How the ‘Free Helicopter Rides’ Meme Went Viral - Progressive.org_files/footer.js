(() => {
  const fixSearch = () => {
     const searchBar = document.querySelector('#mp-search-bar');
     const searchBox = document.createElement('li');
     searchBox.innerHTML = '<button class="search-toggle"></button>';
     document.querySelector('#topnav ul.mainnav').appendChild(searchBox);
     searchBox.classList.add('search-box'); 
     searchBox.appendChild(searchBar);
     const mql = window.matchMedia('(min-width: 48.01em)');
        if (mql.matches) {
            searchBar.classList.add('hidden');
        }
     document.querySelector('button.search-toggle').addEventListener('click', () => {
        if (mql.matches) {
            searchBar.classList.toggle('hidden');
        }
     });
  };
  const winLoad = (callback) => {
    if (document.readyState === 'complete') {
      callback();
    } else {
      window.addEventListener('load', callback);
    }
  };

  winLoad(fixSearch);
})();