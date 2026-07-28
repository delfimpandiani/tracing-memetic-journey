var path_files    = global_domain+"/_files";
var path_jsons    = global_domain+"/_files/jsons";
var path_epg_signals = path_jsons+"/signals";
var selected_signal_number = null;
var selected_signal_interval = null;
var currentURL = window.location.href;

let limitComent = 5;
let actualPost = 0;

var custom_postfix = [
    {
        cat        : "tierra-brava",
        postfix    : "_reality",
        ads_tags : [
            "Top",
            "Middle",
            "Lateral"
        ]
    },
    // {
    //     cat        : "yo-soy",
    //     postfix    : "_reality",
    //     ads_tags   : [
    //         "Top",
    //         "Middle",
    //         "Lateral"
    //     ]
    // }
];

// Función para obtener el elemento según la categoría en la URL
function get_custom_postfix() {
    // Iterar sobre el arreglo de custom_postfix
    for (var i = 0; i < custom_postfix.length; i++) {
        var elemento = custom_postfix[i];
        // Verificar si la categoría está presente en la URL
        if(currentURL.indexOf('/'+elemento.cat+'/') !== -1){
            return elemento;
        }
    }
    return null; // Devolver null si no se encuentra ningún elemento
}

var custom_tags_data = get_custom_postfix();

if(global_section === "single" || global_post_segment_url === "/page/corporativo"){

    Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

        switch (operator) {
            case '==':
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '!=':
                return (v1 != v2) ? options.fn(this) : options.inverse(this);
            case '!==':
                return (v1 !== v2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
    });

    // Registra un helper que devuelve el separador correcto
    Handlebars.registerHelper('separator', function (index, total, separador1=', ', separador2=' y ') {
        // Asegurarse de que sean números
        index = Number(index);
        total = Number(total);
        separador1 = String(separador1);
        separador2 = String(separador2);

        if (total <= 1) return '';                      // si hay 1 o 0 autores -> nada
        if (index === total - 2) return separador2;     // penúltimo -> " y "
        if (index < total - 1) return separador1;       // cualquier otro (no último) -> ", "
        return '';                                      // último -> nada
    });

}

// NOTA - TE PUEDE INTERASAR
var show_posts_te_puede_interesar = function(){

    var new_div = document.querySelectorAll('.main-related-card');
    var resultados = [];
    
    new_div.forEach(function(mas_noticia) {
        // Obtener el 'href' de la primera etiqueta <a>
        var primerEnlace = mas_noticia.querySelector('a');
        var hrefPrimerEnlace = primerEnlace ? primerEnlace.getAttribute('href') : null;
        
        // Obtener el 'src' de la etiqueta <img>
        var imagen = mas_noticia.querySelector('img');
        var srcImagen = imagen ? imagen.getAttribute('src') : null;
        
        // Obtener el innerHTML de la segunda etiqueta <a>
        var segundoEnlace = mas_noticia.querySelector('.main-related-card__title a');
        var innerHTMLSegundoEnlace = segundoEnlace ? segundoEnlace.innerHTML : null;
    
        // Crear un objeto con los resultados
        var datos = {
            post_link: hrefPrimerEnlace,
            imagen_post: srcImagen,
            post_title: innerHTMLSegundoEnlace
        };
    
        // Agregar el objeto al array de resultados
        resultados.push(datos);
    });
    
    // Convertir el array de resultados a formato JSON
    var resultadosJson = JSON.stringify(resultados, null, 2);

    // Seleccionar todos los elementos con la clase '.js-content-post'
    var elementos = document.querySelectorAll('.js-content-post');
    var contador = 0;

    // Iterar sobre cada elemento encontrado que tiene la clase '.js-content-post'
    elementos.forEach(function(elemento) {
        // Obtener todos los hijos del elemento
        var hijos = elemento.children;
        var inicio = 0;

        // Iterar sobre los hijos del elemento
        for (var i = 0; i < hijos.length; i++) {
            // Verificar si el hijo es una etiqueta 'FIGURE'
            if (hijos[i].tagName === 'FIGURE' && hijos[i].classList.contains('main-related-card')) {
                contador += 1;
            }

            // Si el hijo no es una etiqueta 'FIGURE' y el contador es mayor que 0
            if (hijos[i].tagName !== 'FIGURE' && contador > 0) {
                // Actualizar el valor de 'contador' para considerar la vuelta anterior.
                contador = contador + inicio;

                // Insertar un clon del template antes del hijo actual
                elemento.insertBefore(template(inicio, contador).cloneNode(true), hijos[i]);

                // Eliminar las figuras que están detrás del hijo actual
                eliminarFigurasDetras(hijos[i]);

                // Actualizar el valor de 'inicio' y 'contador'
                inicio = contador;
                contador = 0;
            }
        }
    });
        
    function template(inicio, contador){

    var source = document.getElementById("js_te_puede_interesar_template");

    var template    = Handlebars.compile(source.innerHTML);

    var tempContainer = document.createElement('div');

    var posts       = JSON.parse(resultadosJson);

        posts       = posts.slice(inicio, contador);

        if(!posts.length){
            return;
        }

        var html = template({
            posts : posts
        });

        tempContainer.innerHTML = html;

        return tempContainer.firstElementChild;

    }

    // Función para eliminar los elementos <figure> que están detrás de un elemento específico
    function eliminarFigurasDetras(elemento) {
        var anterior = elemento.previousElementSibling;
        while (anterior) {
            if (anterior.tagName === 'FIGURE') {
                var paraEliminar = anterior;
                anterior = anterior.previousElementSibling;
                paraEliminar.remove();
            } else {
                break;
            }
        }
    }

}

var show_inline_related_lee_tambien = function(){

    var lee_tmbn_data_divs = document.querySelectorAll('.js_te_puede_interesar');
    var source = '';
    var cant = false;

    if(global_post_segment_url === '/page/corporativo'){
        source  = document.getElementById("js_corporativo_page_opt");
        cant    = true;
    }else{
        source  = document.getElementById("js_inline_related_lee_tambien_template");
    }

    lee_tmbn_data_divs.forEach(function(lee_tmbn_div) {

        var template    = Handlebars.compile(source.innerHTML);

        var posts       = lee_tmbn_div.dataset.posts;

        posts = JSON.parse(atob(posts));

        console.log(posts);

        if(!posts.length){
            return;
        }

        var html = template({
            posts : cant ? posts : posts.slice(0, 3)
        });

        if(html != ''){
            var skeleton = document.getElementById('skeleton_notas_relacionadas');
            skeleton.classList.add("hidden");
        }
        
        lee_tmbn_div.outerHTML = html;

    });
}


// Notas - Leer tambien (sugerencias dentro del content)
var show_inline_content_lee_tambien = function () {

    var lee_tmbn_data_divs = document.querySelectorAll('.js_inline_content_lee_tambien');

    var source = document.getElementById("js_inline_content_lee_tambien_template");

    lee_tmbn_data_divs.forEach(function (lee_tmbn_div) {

        var template = Handlebars.compile(source.innerHTML);

        var posts = lee_tmbn_div.dataset.posts;

        posts = JSON.parse(atob(posts));

        // console.log(posts); 

        if (!posts.length) {

            return;

        }

        var html = template({

            posts: posts

        });

        lee_tmbn_div.outerHTML = html;

    });

}

var show_posts_te_puede_interesar_video = function(){

    var te_puede_interesar_divs = document.querySelectorAll('.js_te_puede_interesar_video');

    var source      = document.getElementById("js_te_puede_interesar_video_template");

    te_puede_interesar_divs.forEach(function(te_puede_interesar_div) {

        var template    = Handlebars.compile(source.innerHTML);

        var posts       = te_puede_interesar_div.dataset.posts;

        posts = posts ? JSON.parse(posts) : posts;

        if(!posts.length){
            return;
        }

        posts = posts.slice(0, 4);

        var html = template({
            posts : posts
        });
        
        te_puede_interesar_div.outerHTML = html;

    });
}

var show_post_tags = function(){

    var tags_data_divs = document.querySelectorAll('.js_post_tags');
    var source = document.getElementById("tags_posts_template");

    tags_data_divs.forEach(function(tag_div) {

        var template = Handlebars.compile(source.innerHTML);
        var post_tags_str = tag_div.dataset.tags;

        if (!post_tags_str.length) {
            return;
        }

        // Convertimos de string a array de objetos
        var post_tags = JSON.parse(post_tags_str);

        // Ordenamos para que el tag con primary: true quede primero
        post_tags.sort((a, b) => {
            return (b.primary === true) - (a.primary === true);
        });

        // Ahora sí, renderizamos el template con los tags ordenados
        var html = template({
            post_tags: post_tags
        });

        tag_div.outerHTML = html;
    });
};

var show_post_tags_video = function(){

    var tags_data_divs = document.querySelectorAll('.js_post_video_tags');

    var source      = document.getElementById("tags_posts_videos_template");

    tags_data_divs.forEach(function(tag_div) {

        var template    = Handlebars.compile(source.innerHTML);

        var post_tags = tag_div.dataset.tags;

        if(!post_tags.length){
            return;
        }

        var html = template({
            post_tags       : JSON.parse(post_tags)
        });
        
        tag_div.outerHTML = html;

    });
}

// PAGE - BROCHURE PROGRAMAS
var show_page_brochure_programa = function(){

    var brochure_programas_divs = document.querySelectorAll('.js_brochure_programas');

    var source      = document.getElementById("js_brochure_programas_template");

    brochure_programas_divs.forEach(function(brochure_programas) {

        var template    = Handlebars.compile(source.innerHTML);

        var posts       = brochure_programas.dataset.posts;

        posts = JSON.parse(posts);

        if(!posts.length){
            return;
        }

        var html = template({
            posts : posts
        });
        
        brochure_programas.outerHTML = html;

    });
    
}

var audio_width = function(){
    var audio = document.querySelector('audio');

    if(audio){
        audio.setAttribute('style', 'width: 100%');
    }
}

var page_servel = function() {

    var url = ['/page/frecuencias/', '/page/tarifas-servel/', '/page/contacto/'];
    
    // Verifica si global_post_segment_url está en el array
    if (typeof global_post_segment_url !== 'undefined' && url.includes(global_post_segment_url)) {
        var tabla = document.querySelector('.tablepress');
        if (tabla) {
            var enlace = tabla.querySelector('a');
            if (enlace) {
                enlace.remove(); // Remueve el enlace si existe
            }
        }
    }
};

var send_post_count = function(post_id, date){

    if(typeof post_id=='undefined') return false;
    if(typeof global_url_ajax=='undefined') return false;
    if(global_url_ajax=='') return false;

    // const data = {
    //     publish_date: new Date(date).toISOString(), // Cambié 'date' a 'publish_date'
    // };

    $.ajax({
        url: global_url_ajax,
        dataType: "json",
        type: 'POST',
        // data: {action: "count_post" , post: post_id, body: JSON.stringify(data)},
        data: {action: "count_post" , post: post_id, body: date},
        cache: false,
        // contentType: false,
        // processData: false,
        success: function(data){
            // console.log(data);
            return;
        },
        error: function(){
            console.error("Ocurrio un error procesando los datos. ");
        }
    });
}

var submitComment = async function(postId, authorName, authorEmail, commentContent){

    // const endpoint = `https://backend.agricultura.test/wp-json/wp/v2/comments`;
    const dataComent = {
      action: "comment_post",
      post: postId,
      author_name: authorName.value,
      author_email: authorEmail.value,
      content: commentContent.value,
    };

    console.log(dataComent);

    $.ajax({
        url: global_url_ajax,
        dataType: "json",
        type: 'POST',
        data: dataComent,
        cache: false,
        success: function(data){

            const container2 = document.querySelector(".getComments-"+postId);

            const commentHTML = `
                        <div class="comment-item">
                            <div class="comment-author">${authorName.value}</div>
                            <div class="comment-date">${new Date().toLocaleDateString()}</div>
                            <div class="comment-content">${commentContent.value}</div>
                        </div>
                    `;

            container2.insertAdjacentHTML("afterbegin", commentHTML);
            // container2.innerHTML += commentHTML;

            authorName.value = '';
            authorEmail.value = '';
            commentContent.value = '';

            const container = document.querySelector(".commentMesseg-"+postId);
            container.style.display='block';
            container.classList.add('comment-msg-success');
            msg = `Tu comentario fue enviado con exito`;
            container.innerHTML += msg;
            setTimeout(() => {
                container.classList.remove('comment-msg-success');
                container.style.display='none';
                container.innerHTML = ""; // Limpiar contenedor
            }, 3000)
            console.log(data);
        },
        error: function(){
            console.error("Ocurrio un error procesando los datos. ");
        }
    });

}

var getComment = async function(postId, limitP = 5){

    if(postId != actualPost || actualPost == 0){
        limitComent = 5;
        actualPost = postId;
    }

    const dataComent = {
        action: "comment_get",
        post: postId,
        limit: limitP,
    };

    $.ajax({
        url: global_url_ajax, // URL del servidor PHP
        dataType: "json", // Esperamos una respuesta JSON
        type: "POST",
        data: dataComent,
        cache: false,
        success: function (response) {
            const container = document.querySelector(".getComments-"+postId);

            if (!container) {
                console.error(`No se encontró el contenedor para el postId: ${postId}`);
                return;
            }

            // Verificar si la respuesta es exitosa
            if (!response.success) {
                console.error("Error en la respuesta del servidor:", response);
                container.innerHTML = '<div style="text-align: center;">Error al cargar comentarios.</div>';
                return;
            }

            // Obtener los comentarios
            const comments = response.data;

            // Si hay comentarios, construirlos dinámicamente
            if (Array.isArray(comments) && comments.length > 0) {
                container.innerHTML = ""; // Limpiar contenedor
                comments.forEach(comment => {
                    const commentHTML = `
                        <div class="comment-item">
                            <div class="comment-author">${comment.author_name}</div>
                            <div class="comment-date">${new Date(parseInt(comment.date.$date.$numberLong)).toLocaleDateString()}</div>
                            <div class="comment-content">${comment.content}</div>
                        </div>
                    `;
                    container.innerHTML += commentHTML;
                });

                button = `<button type="none" class="form-button" style="align-self: auto;" onclick="masComentarios(${postId})">Ver mas commentarios</button>`;

                container.innerHTML += button;

            } else {
                container.innerHTML = '<div class="comment-item" style="text-align: center;">No hay comentarios para este post.</div>';
            }
        },
        error: function (xhr, status, error) {
            console.error("Error en la solicitud AJAX:", status, error);
        }
    });
};

var masComentarios = async function(postId){

    if(postId != actualPost || actualPost == 0){
        limitComent = 5;
        actualPost = postId;
    }

    limitComent += 5;
    
    getComment(postId, limitComent);
}

var load_bradcrumbs = function () {

    var bradcrumbsItems = document.querySelectorAll('.js-bradcrumbs');
    var source = document.getElementById("js-bradcrumbs_templates");

    bradcrumbsItems.forEach(function (item) {

        var template = Handlebars.compile(source.innerHTML);

        var posts = JSON.parse(atob(item.dataset.item));

        if (!posts.length) {
            return;
        }

        // posts = posts.reverse();

        var accumulatedPath = '';

        posts = posts.map(function (post) {
            accumulatedPath += post.slug;
            return {
                ...post,
                name: capitalizeFirstLetter(post.name),
                // url: accumulatedPath
            };
        });

        var html = template({
            posts: posts
        });

        if (html != '') {
            // Buscar skeleton en hermano anterior o siguiente
            let skeleton = item.previousElementSibling;

            if (!skeleton || !skeleton.hasAttribute('data-skeleton')) {
                skeleton = item.nextElementSibling;
            }

            if (skeleton && skeleton.hasAttribute('data-skeleton')) {
                skeleton.classList.add('hidden');
            }
        }

        item.outerHTML = html;
    });
};

function capitalizeFirstLetter(text) {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
}

var show_author_extra = function (div_data) {

    var div_extra_autores = document.querySelectorAll(div_data);

    var source = document.getElementById("js_inline_autores_extra_template");

    div_extra_autores.forEach(function (div_autores) {

        var template = Handlebars.compile(source.innerHTML);
        var posts = div_autores.dataset.autores;

        posts = JSON.parse(atob(posts));

        if (!posts.length) {
            return;
        }

        var html = template({
            title: posts.titulo,
            posts: posts
        });

        if (html != '') {
            // Buscar skeleton en hermano anterior o siguiente
            let skeleton = div_autores.previousElementSibling;

            if (!skeleton || !skeleton.hasAttribute('data-skeleton')) {
                skeleton = div_autores.nextElementSibling;
            }

            if (skeleton && skeleton.hasAttribute('data-skeleton')) {
                skeleton.classList.add('hidden');
            }
        }

        div_autores.outerHTML = html;

    });

}

var date_update = function() {

    const timeEl = document.querySelectorAll('.main-article-heading__date');
    
    timeEl.forEach( function(elem){

        var publishedDate = new Date(elem.getAttribute('datetime'));
        var publishedDateText = elem.dataset.date
    
        var nowChile = new Date(
        new Intl.DateTimeFormat('sv-SE', {
            timeZone: 'America/Santiago',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(new Date()).replace(' ', 'T')
        );
    
        var diffMs = nowChile - publishedDate;
        var diffMinutes = Math.floor(diffMs / 1000 / 60);
        var diffHours = Math.floor(diffMinutes / 60);
        // var diffDays = Math.floor(diffHours / 24);
    
        let text;
    
        if (diffMinutes < 1) {
        text = 'Updated a few seg ago';
        } else if (diffMinutes < 60) {
        text = `Updated ${diffMinutes} min ago`;
        } else if (diffHours < 24) {
        text = `Updated ${diffHours} hours ago`;
        } else {
        text = publishedDateText;
        }
    
        elem.classList.remove('skeleton-rect');
        elem.innerHTML = text;
        // console.log(text);
    })

}

  
var reloadForSPA = function(show = true) {

    // show_inline_content_lee_tambien();
    show_post_tags();
    show_post_tags_video();
    // show_post_categories();
    show_posts_te_puede_interesar();
    show_posts_te_puede_interesar_video();

    show_page_brochure_programa();
    audio_width();

    if(global_consent_mode == 1){
        cookies_consent();
        listen_modal();
    }

    if(show){
        cargarPublicidad();
    }

    // if(global_section === "single"){
    //     send_post_count(global_post_id, datePublished);
    // }

};

document.addEventListener("DOMContentLoaded", function(event) {

    show_inline_related_lee_tambien();
    show_inline_content_lee_tambien();
    show_post_tags();
    show_post_tags_video();
    load_bradcrumbs();
    // show_post_categories();
    show_posts_te_puede_interesar();
    show_posts_te_puede_interesar_video();

    show_page_brochure_programa();
    audio_width();

    if(global_consent_mode == 1){
        cookies_consent();
        listen_modal();
    }

    show_author_extra('.js-extra-data');
    date_update();

    // if(global_section === "single"){
    //     send_post_count(global_post_id, datePublished);
    // }

    //OCUTAMOS ADS COMENTADOS
    document.querySelectorAll('._rtb_slot').forEach(function(element) {
        $this = $(element);
        var $parent = $this.closest('.u-the-banner');
        if ($parent) {
            $parent.css({
                'display': 'none',
            });
        }
        else{
            $this.css({
                'display': 'none',
            });
        }
    });

    // cargarPublicidad();
});