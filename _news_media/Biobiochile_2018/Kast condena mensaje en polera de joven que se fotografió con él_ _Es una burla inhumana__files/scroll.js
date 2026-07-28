BBCL_SCROLL = (function() {
    var adsName = {
        'group-economia': 'economia',
        'group-sociedad': 'sociedad',
        'group-ciencia-y-tecnologia': 'tecnologia',
        'group-artes-y-cultura': 'cultura',
        'group-espectaculos-y-tv': 'espectaculos',
        'group-mujer': 'mujer',
        'group-hombre': 'hombre',
        'group-vida-actual': 'hombre',
        'group-opinion': 'opinion',
        'group-blogs': 'opinion',
        'group-deportes': 'deporte',
        'group-futbol': 'deporte',
        'futbol-internacional': 'deporte',
        'group-salud-y-bienestar': 'salud',
        'categoriatest': 'espectaculos'
    }

    var categories = {
        nacional: 'group-nacional',
        internacional: 'group-internacional',
        economia: 'group-economia',
        opinion: 'group-opinion',
        blogs: 'grup-opinion',
        deportes: 'group-deportes',
        futbol: 'group-deportes',
        'futbol-internacional': 'group-deportes',
        economia: 'group-economia',
        'ciencia-y-tecnologia': 'group-ciencia-y-tecnologia',
        sociedad: 'group-sociedad',
        'artes-y-cultura': 'group-artes-y-cultura',
        'espectaculos-y-tv': 'group-espectaculos-y-tv',
        vida: 'group-vida-actual',
        'vida-actual': 'group-vida-actual',
        'salud-y-bienestar': 'group-salud-y-bienestar',
        'turismo-y-viajes': 'group-turismo-y-viajes',
        categoriatest: 'categoriatest'
    }

    function scroll(category, idsToExclude, isMobile) {
        var countArticle = idsToExclude.length
        var realCategory = getRealCategory(category)

        return fetchScrollArticle(realCategory, idsToExclude).then(function(article) {
            if (article) {
                var primaryCategory = article['post_category_primary']['slug']
                var secondaryCategory = article['post_category_secondary']['slug']

                article.banners = getArticleBanners(primaryCategory, secondaryCategory, countArticle, isMobile)

                if (!isMobile) {
                    return axios
                        .all([
                            fetchScrollStatics(primaryCategory, secondaryCategory, 'destacados').catch(function() {
                                return null
                            }),
                            fetchScrollStatics(primaryCategory, secondaryCategory, 'mas_leidos').catch(function() {
                                return null
                            })
                        ])
                        .then(
                            axios.spread(function(destacados, masLeidos) {
                                article.destacados = destacados
                                article.mas_leidos = masLeidos
                                return article
                            })
                        )
                }
            }

            return article
        })
    }

    function getRealCategory(category) {
        return category in categories ? categories[category] : 'group-nacional'
    }

    function fetchScrollArticle(category, idsToExclude) {
        var baseUrl = 'https://www.biobiochile.cl/static/json-scroll-notas/' + category + '/'

        return axios(baseUrl + 'orden.json?v=' + Date.now()).then(function(data) {
            var ids = data.data

            for (var i = 0; i < ids.length; ++i) {
                var id = ids[i]

                if (idsToExclude.indexOf(id) === -1) {
                    return axios(baseUrl + id + '.json?v=' + Date.now()).then(function(data) {
                        return data.data
                    })
                }
            }

            return null
        })
    }

    function getArticleBanners(primaryCategory, secondaryCategory, countArticle, isMobile) {
        var ad =
            primaryCategory in adsName && secondaryCategory !== 'se-dijo-en-la-radio'
                ? adsName[primaryCategory]
                : 'noticias'

        var banners = {}

        ad = ad === 'hombre' ? 'vida' : ad

        if (isMobile) {

            banners.banner_1 = {
                nombre: '/1098385/300x250_movil_' + ad + '_1',
                width: 300,
                height: 250,
                id: 'ad-scroll-' + ad + '-banner-1-' + countArticle
            }

            banners.banner_2 = {
                nombre: '/1098385/300x250_movil_' + ad + '_2',
                width: 300,
                height: 250,
                id: 'ad-scroll-' + ad + '-banner-2-' + countArticle
            }

            banners.banner_3 = {
                nombre: '/1098385/300x250_movil_' + ad + '_3',
                width: 300,
                height: 250,
                id: 'ad-scroll-' + ad + '-banner-3-' + countArticle
            }

        } else {
            banners.cabecera = {
                nombre: '/1098385/1000x75_gran_titular_' + ad,
                width: 1000,
                height: 75,
                id: 'ad-scroll-' + ad + '-cabecera-' + countArticle
            }

            banners.contenido = {
                nombre: '/1098385/300x250_' + ad + '_bb',
                width: 300,
                height: 250,
                id: 'ad-scroll-' + ad + '-contenido-' + countArticle
            }

            banners.lateral_1 = {
                nombre: '/1098385/250x250_' + ad + '_esc_4',
                width: 250,
                height: 250,
                id: 'ad-scroll-' + ad + '-lateral-1-' + countArticle
            }

            banners.lateral_2 = {
                nombre: '/1098385/250x250_' + ad + '_esc_5',
                width: 250,
                height: 250,
                id: 'ad-scroll-' + ad + '-lateral-2-' + countArticle
            }

            banners.lateral_3 = {
                nombre: '/1098385/250x250_' + ad + '_esc_8',
                width: 250,
                height: 250,
                id: 'ad-scroll-' + ad + '-lateral-3-' + countArticle
            }

            banners.lateral_4 = {
                nombre: '/1098385/250x250_' + ad + '_esc_9',
                width: 250,
                height: 250,
                id: 'ad-scroll-' + ad + '-lateral-4-' + countArticle
            }

            banners.after_contenido = {
                nombre: '/1098385/728x90_' + ad + '_esc_15',
                width: 728,
                height: 90,
                id: 'ad-scroll-' + ad + '-after-contenido-' + countArticle
            }

            banners.after_comentarios = {
                nombre: '/1098385/1000x200_' + ad + '_esc_21',
                width: 1000,
                height: 200,
                id: 'ad-scroll-' + ad + '-after-comentarios-' + countArticle
            }
        }

        banners.ad_name = ad

        return banners
    }

    function fetchScrollStatics(primaryCategory, secondaryCategory, type) {
        var base = 'https://www.biobiochile.cl/escritorio/bbcl/base/secciones_new/notas/' + type + '/'
        var deportes = ['group-deportes', 'group-futbol', 'futbol-internacional']
        var opinion = ['group-opinion', 'group-blogs']
        var secondaryCategories = ['se-dijo-en-la-radio', 'videos', 'videos-tendencias']
        var mundoActual = ['group-hombre', 'group-mujer']
        var groupNacional = ['reportajes', 'educacion-especiales']
        var file

        if (deportes.indexOf(primaryCategory) !== -1) {
            file = 'group-deportes.shtml'
        } else if (opinion.indexOf(secondaryCategory) !== -1) {
            file = 'group-opinion.shtml'
        } else if (secondaryCategories.indexOf(secondaryCategory) !== -1) {
            file = secondaryCategory + '.shtml'
        } else if (mundoActual.indexOf(primaryCategory) !== -1) {
            file = 'mundo-actual.shtml'
        } else if (groupNacional.indexOf(primaryCategory) !== -1) {
            file = 'group-nacional.shtml'
        } else {
            file = primaryCategory + '.shtml'
        }

        return axios(base + file).then(function(data) {
            return data.data
        })
    }

    return scroll
})()
