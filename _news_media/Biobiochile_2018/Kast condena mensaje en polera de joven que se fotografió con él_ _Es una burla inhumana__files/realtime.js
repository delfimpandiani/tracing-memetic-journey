BB_REALTIME = (function () {

  var intervalId = null
  var allowParams = [
    'referrer'
  ]

  function hit(options) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        processResponse(this.responseText)
      }
    };

    var parameters = Object.assign({ 
      t: Date.now(), 
      user: localStorage.getItem('bb-realtime-user'), 
      url: location.href
    }, options)

    var parametersString = Object.keys(parameters).reduce(function (prev, curr) {

      if (parameters[curr] != null) {
        prev.push(curr + '=' + encodeURIComponent(parameters[curr]))
      }

      return prev
    }, []).join('&')

    xhr.open(
      'POST',
      'https://realtime.bbcl.cl/hit/?' + parametersString
    );
    xhr.timeout = 18000;


    xhr.send();
    console.log('BB REALTIME HIT')
  }

  function processResponse(data) {
    if (data) {
      localStorage.setItem('bb-realtime-user', data)
    }
  }

  function init(property, options) {
    console.log('BB REALTIME INITIATED')

    var defaults = {
      referrer: document.referrer
    }
    var filteredOptions = {
      property: property
    }

    if (options == null) {
      options = {}
    }

    allowParams.forEach(function (param) {
      if (options[param] != null) {
        filteredOptions[param] = options[param]
      } else if (defaults[param] != null) {
        filteredOptions[param] = defaults[param]
      }
    })

    hit(filteredOptions)
    intervalId = setInterval(hit, 50 * 1000, filteredOptions)
  }

  function stop() {
    clearInterval(intervalId)
  }

  return {
    init: init,
    stop: stop
  }
})()