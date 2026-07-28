var old_link_post_view=0;

var count_scroll = 0;

function calcularPorcentajeVisible(b) {

    var g = b.height();

    b = b.offset().top;

    return 100 * ($(window).scrollTop() - b + 150) / g;

}

// Se crea una funcion JQuery para determinar si la nota esta visible en la pantalle

(function($){

    $.fn.isOnScreen = function(x, y){

        if(x == null || typeof x == 'undefined') x = 1;

        if(y == null || typeof y == 'undefined') y = 1;

        var win = $(window);

        var viewport = {

            top : win.scrollTop(),

            left : win.scrollLeft()

        };

        viewport.right = viewport.left + win.width();

        viewport.bottom = viewport.top + win.height();

        var height = this.outerHeight();

        var width = this.outerWidth();

        if(!width || !height){

            return false;

        }

        var bounds = this.offset();

        bounds.right = bounds.left + width;

        bounds.bottom = bounds.top + height;

        var visible = (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));

        if(!visible){

            return false;

        }

        var deltas = {

            top : Math.min( 1, ( bounds.bottom - viewport.top ) / height),

            bottom : Math.min(1, ( viewport.bottom - bounds.top ) / height),

            left : Math.min(1, ( bounds.right - viewport.left ) / width),

            right : Math.min(1, ( viewport.right - bounds.left ) / width)

        };

        return (deltas.left * deltas.right) >= x && (deltas.top * deltas.bottom) >= y;

    };

})(jQuery);

// Carga las notas relacionadas

function getTheUpperArticle(articles, parent) {

    // si la paganida no de single no se ejecuta

    if(global_section != 'single')

        return false;

    // si la paganida es de un single PODCAST no se ejecuta

    if(global_post_tags.some(item => item.name === "Episodios Completos"))

        return false;

    var $articles            = $(articles);

    var mainSectionScrollTop = $(parent).offset().top;

    var windowScrollTop      = $(window).scrollTop();

    if ( (windowScrollTop >= mainSectionScrollTop)  ) {

        $.each($articles, function(index, element) {

            

            // var $element                = $(element);

            var $element                = $('.js-content-static-scroll').eq(index);

            var $elementHeight          = $element.outerHeight(true);

            var scrollTop               = $element.position().top;

            var scrollBottom            = $elementHeight + scrollTop;

            var inElementScrollTop      = windowScrollTop - scrollTop;

            var $elementSeparatorBar    = $('.js-content-static-scroll').eq(global_count_articles).find('.separator-bar');

            // var $listItemCircle         = $('.js-link-item-post[data-id="'+ $element.data('id') +'"]');

            if (windowScrollTop >= scrollTop && windowScrollTop <= scrollBottom) {

                $element.addClass('is-current');

                // Get the percentage from the element top

                var percentage = (inElementScrollTop * 100) / $elementHeight;

                percentage     = Math.round(percentage);

                percentage = (percentage <= 25) ? 0 : percentage;

                percentage = (percentage >= 85) ? 100 : percentage;

                //*******************************************************************

                //GET VIEW

                if(typeof json_articles[index]!='undefined' && old_link_post_view!=json_articles[index].post_link){

                    old_link_post_view = json_articles[index].post_link;

                }

                //*******************************************************************

                //*******************************************************************

                //CHANGE URL AND TITLE

                // if( $elementSeparatorBar.isOnScreen(0.8, 0.8) ){

                if(typeof json_articles[index]!='undefined' && (percentage>=0 && percentage<=80) ){

                    var old_state = '';

                    if(index==0){

                        old_state = global_post_segment_url.substr(1,global_post_segment_url.length);

                    }

                    if(typeof window.history.state!='undefined' && window.history.state!=null && typeof window.history.state.article!='undefined' )

                        old_state = window.history.state.article;

                    if(old_state!=json_articles[index].post_link){

                        document.title = $("<textarea/>").html(json_articles[index].post_title).val();

                        window.history.replaceState({article:json_articles[index].post_link}, $("<textarea/>").html(json_articles[index].post_title).val(), global_domain+'/'+json_articles[index].post_link);

                        // Establece la ubicación actual y la URL de la página para Google Analytic

                        // gtag('event', 'screen_view', {});//envia el pageview de la nueva pagina
                        // if(json_articles[index].autor){
                        //     console.log('/////////////////////////////////////////');
                        //     console.log(json_articles[index].post_title);
                        //     console.log(json_articles[index].post_link);
                        //     console.log('2.*** Enviando Author '+ json_articles[index].autor+' ***');
                        // }

                        if(json_articles[index].autor){

                            gtag('config', 'YG-TFCNNMQNYN', {
                                'page_title': json_articles[index].post_title,
                                'page_path': '/' + json_articles[index].post_link
                            });

                            gtag('event', 'page_view', {
                                'author_name': json_articles[index].autor // Esto obtiene el autor de la nota
                            });

                            console.log(json_articles[index].post_title);
                            console.log('JS - '+json_articles[index].autor);
                        }

                        // Establece la ubicación actual y la URL de la página

                        // gtag('event', 'page_view', {

                        //     'page_title': json_articles[index].post_title,  // Si tienes el título del artículo

                        //     'page_location': global_domain + '/' + json_articles[index].post_link,

                        //     'author_name': json_articles[index].autor // Esto obtiene el autor de la nota

                        // });

                        
                        // send_post_count(json_articles[index].id_post);
                        

                    }

                }

                //*******************************************************************

                if( (global_count_articles+1)<json_articles.length && !global_flag ){

                    if( $elementSeparatorBar.isOnScreen(0.8, 0.8) ){

                        global_flag       = true;

                        var url_get = '/'+json_articles[global_count_articles+1].post_link+'?content=basic';

                        $elementSeparatorBar.find('.post_loading').fadeIn();

                        $.get(url_get, function(data_get){

                            

                            // 1. Creamos un contenedor temporal donde insertar el HTML

                            var $tempDiv = $('<div></div>'); 

                            

                            // 2. Insertamos el string de data_get dentro del contenedor

                            $tempDiv.html(data_get);

                            

                            // 3. Eliminamos el <script> con id 'script-insert'

                            $tempDiv.find('script#script-insert').remove();

                            

                            // 4. Convertimos el contenido HTML de vuelta en string

                            var modifiedHtml = $tempDiv.html();

                            

                            // 5. Insertamos el HTML modificado en el contenedor deseado

                            $elementSeparatorBar.find('.post_loading').fadeOut();

                            $(".js_main_content").append( modifiedHtml );

                            // $elementSeparatorBar.find('.post_loading').fadeOut();

                            // $(".js_main_content").append( data_get );

                            global_count_articles++;

                            global_flag = false;

                            // se recargan los metodos del archivo functionalities.js

                            // reloadForSPA(false);

                            // Refrescamos los nuevos enlaces para que funcione el SPA

                            // startEventAjaxCustomLink('.js-content-static .js-link-static a');

                            //***********************

                            //LOAD TAGS

                            // loadTags();

                            // show_post_tags();

                            // show_post_tags_video();

                            //***********************

                            var modalITT = $('#modal-ads');

                            modalITT.css('display', 'none');

                            ++count_scroll;
                            state = false;

                            console.log(count_scroll);

                            if(count_scroll > 1){
                                state = true;
                                count_scroll = 0;
                            }

                            cargarPublicidad(state);
                            load_bradcrumbs();
                            date_update();
                            show_inline_content_lee_tambien();

                            //***********************

                            //LOAD EMBED RUDO

                            // loadEmbedRudo();

                            //***********************

                            // Recarga EMBED de Instagram
                            if (typeof instgrm !== 'undefined' && instgrm.Embeds && typeof instgrm.Embeds.process === 'function') {
                                instgrm.Embeds.process();
                            }

                            // Recarga comentarios de Facebook
                            if (typeof FB !== 'undefined' && FB.XFBML && typeof FB.XFBML.parse === 'function') {
                                FB.XFBML.parse();
                            }

                        }).fail(function(){

                            $elementSeparatorBar.find('.post_loading').fadeOut();

                            console.log('Error al cargar la data');

                        });

                    }

                }

                // index, percentage

            } else {

                $element.removeClass('is-current');

            }

        });

    }

    else{

    }

}

function loadItemPostSidebar(){

    // Optiene la variables de la nota y Forzamos la ejecución del script

    $('.js_main_content').find('script').each(function(){

        var script = document.createElement('script');

        script.text = $(this).text();

        document.body.appendChild(script);  // Añadimos el script al body para que se ejecute

    });

    if(typeof global_dev_scroll=='undefined' || global_dev_scroll==false ){

        return false;

    }

    if( !$('.js-content-static-scroll')[0] ){

        return false;

    }

    json_articles.push({

        post_title  : $('.js-content-static-scroll:eq(0) .main-single__title').text(),

        post_link    : global_post_segment_url.slice(1, global_post_segment_url.length )

    });

    posts = JSON.parse(atob(global_last_posts));

    posts.forEach(function(item){

        json_articles.push(item);

    });

    getTheUpperArticle('.main__container', '.js-content-static-scroll');

    // cuando se hace scroll se ejecuta la funcion que carga las notas relacionadas

    window.addEventListener('scroll', function() {

        getTheUpperArticle('.main__container', '.js-content-static-scroll');

    });

    old_link_post_view = global_post_segment_url;

}

// Se inicializan el scroll si es por navegacion del SPA

function scrollForSPA(){

    global_dev_scroll = true;

    loadItemPostSidebar();    

}

// Se inicializan el scroll si se entra al sitio desde una noticia

$(document).ready(function(){

    global_dev_scroll = true;

    loadItemPostSidebar();

    cargarPublicidad();

});

