

var realtime_length = undefined;

var update_realtime_items = true;



var realTimeFunctions = {

	url : global_domain_image,

	path : 'real_time',

	$element : jQuery('.js-rtb-real-time'),

	attrs : ['key'],

	handlebars_id : false,

	onLoadFunction : null, //FUNCION A EJECUTAR AL CARGAR EL HTML

	is_mobile : function(){

		  var check = false;

		  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);

		  return check;



		  // if(typeof window.orientation!='undefined')

		  // 	return true;

		  // else

		  // 	return false;

	},

	create : function(){

		var $element =  this.$element;

		if(typeof $element=='undefined' || $element=='' ){

			console.log('Elemento no definido');

			return false;

		}





		if($element.length>0){

			$element.each(function(i, item){

				var $item = jQuery(item);

				var attrs = $item.data();

				var file  = realTimeFunctions.getFileUrl(attrs.key);

				if(file!=false){

					realTimeFunctions.getJson($item, file);

				}

			});

		}



	},

	getAttr : function(data){

		if(typeof data!='object' ){

			return [];

		}

		var attrs     = this.attrs;

		var data_attr = {};

		$.each(data, function(i,item){

			data_attr[i] = '';

			if( attrs.indexOf(i)>=0 ){

				data_attr[i] = item;

			}

		});

		return data_attr;

	},

	getFileUrl : function(key){

		if(typeof key!='string' || key==''){

			return false;

		}

		var random = Math.floor((Math.random() * 10000) + 1);

		if(this.path!='')

			return this.url+'/'+this.path+'/'+key+'.json?r='+random;

		else

			return this.url+'/'+key+'.json?r='+random;

	},

	getJson : async function($element, url){

		jQuery.ajax({

			url: url,

			dataType: 'json',

			cache: false,

			success: async function(data) {

				if (typeof data !== 'object' || typeof data.key === 'undefined') {

					return false;

				}



				update_realtime_items = false;



				if(typeof realtime_length == "undefined"){

					update_realtime_items = true;

				}

				else if(realtime_length !== data.total){

					update_realtime_items = true;

				}



				realtime_length = data.total;



				if(!update_realtime_items){

					console.log("No actualizamos realtime");

					return;

				}



				var html = await realTimeFunctions.html(data);

				

				$element.html(html);

		

				// FUNCION AL CARGAR EL HTML

				if (typeof realTimeFunctions.onLoadFunction === 'function') {

					realTimeFunctions.onLoadFunction();

				}





				if ( typeof window.instgrm !== 'undefined' ) {

					window.instgrm.Embeds.process();

				}



			},

			error: function(error) {

				console.log("error al cargar");
				console.log(error);

			}

		});

	},

	html : async function(json_data){

		var html = '';





		if(this.handlebars_id!=false && typeof this.handlebars_id=='string' && jQuery(this.handlebars_id)[0] ){



			var source   = jQuery(this.handlebars_id).html();

			var template = Handlebars.compile(source);

			html         = template({data:json_data});

		}

		else{

            

			var html_item = '';

			if(json_data.items.length>0){

				if(global_section == 'home'){
					width_mm = '100%';
				}else{
					width_mm = '90%';
				}

				titulo_mm = `<h4 class="the-bag | all:my-end-20" data-color="yellow">${json_data.title}</h4>`

				// console.log(json_data.items);

				for (var i = 0; i < json_data.items.length; i++) {

					var item  = json_data.items[i];

					var title = item.title;

					var imagen = '';

					var block_img = '';

					var style_article = 'style="--grid-cols: 1fr; padding: 0.5rem;"';

					// console.log(item);
									

					if(item.url!=''){

						datos_url = await realTimeFunctions.obtenerImagenMeta(item.url);

						html_item += '<div class="min-a-min-box__item">'
										+'<time datetime="" class="min-a-min-box__date" >'+item.date.replace(/\./g, '/')+' | '+item.hour+'</time>'
										+'<div class="min-a-min-box__body">'
											+'<div class="min-a-min-box__text">'
												+'<h2>'+title+'</h2>'
												+'<p>'+item.content.replace(/<\/?p>/g, '')+'</p>'
												+'<div class="related-card">'
													+'<div class="related-card__media">'
														+'<picture class="related-card__picture">'
															+'<source srcset="'+datos_url['imagen']+'" media="(max-width: 767px)" >'
															+'<img loading="lazy" src="'+datos_url['imagen']+'" alt="{title}" width="349" height="236" class="related-card__image | u-aspect-ratio" style="--mobile-aspect-ratio: 315/192; --desktop-aspect-ratio: 349/236;" >'
														+'</picture>'
													+'</div>'

													+'<div class="related-card__caption">'
														+'Ver también: <br>'
														+'<a href="'+item.url+'" target="_blank" class="related-card__permalink">'+datos_url['titulo']+'</a>'
													+'</div>'
												+'</div>'
											+'</div>'
										+'</div>'
									+'</div>'

					} else {

						html_item += '<div class="min-a-min-box__item">'
										+'<time datetime="" class="min-a-min-box__date" >'+item.date.replace(/\./g, '/')+' | '+item.hour+'</time>'
										+'<div class="min-a-min-box__body">'
											+'<div class="min-a-min-box__text">'
												+'<h2>'+title+'</h2>'
												+'<p>'+item.content.replace(/<\/?p>/g, '')+'</p>'
											+'</div>'
										+'</div>'
									+'</div>'

					}

				}

			}

			// html = '<div class="highlight-section__item | timeline-section " style="width:'+width_mm+';"><h3 class="the-title | all:my-end-16">Minuto a minuto</h3>'
			// + titulo_mm 
			// +'<div class="timeline-container">'+ html_item+'</div'
			// +'</div>';

			console.log(html_item);

			html = '<div class="min-a-min-box">'
				  +'<h3 class="the-title | all:my-end-16">Minuto a minuto</h3>'
				  + html_item
				  +'</div>';

		}

		

		return html;

	},

	obtenerImagenMeta: async function(url) {
		try {
			new_url = url.replace('https://eldinamo.test','https://front-chv.dpsgo.com');
			// Obtener el contenido HTML de la URL
			const response = await fetch(new_url);
			const html = await response.text();
	
			// Cargar el HTML en un DOMParser
			const parser = new DOMParser();
			const doc = parser.parseFromString(html, 'text/html');
	
			// Buscar las meta tags
			const metas = doc.querySelectorAll('meta');

			var meta_data = [];
	
			// Recorrer las meta tags en busca de og:image
			for (let meta of metas) {
				if (meta.getAttribute('property') === 'og:image') {
					meta_data['imagen'] = meta.getAttribute('content'); // Retorna la URL de la imagen
				}

				if (meta.getAttribute('property') === 'og:title') {
					meta_data['titulo'] = meta.getAttribute('content'); // Retorna la URL de la imagen
				}

				if (meta.getAttribute('property') === 'og:description') {
					meta_data['description'] = meta.getAttribute('content'); // Retorna la URL de la imagen
				}
			}
			return meta_data;
		} catch (error) {
			console.error('Error al obtener la imagen meta:', error);
		}
	
		return null;
	}



};



// RESPONSIVE VIDEOS

var setResponsiveVideo = function() {

    var toResponsive  = Array.prototype.join.call(arguments);

    var $toResponsive = jQuery(toResponsive);



    jQuery.each($toResponsive, function(i, el) {

        var $element = jQuery(el);

        var $parent  = $element.parent();



        if (!$parent.hasClass('u-responsive-video'))

            $element.wrap('<div class="u-responsive-video"></div>');

    });

};



// ******************************************************

// FUNCION A EJECUTAR AL CARGAR EL REAL TIME

var onLoadRealtime = function(){

    // ******************************************************

    // RESPONSIVE VIDEO

    setResponsiveVideo('iframe[src*="rudo"]', 'iframe[src*="youtube"]', 'iframe[src*="vimeo"]', 'video', 'audio', 'iframe[src*=docdroid]');

    // ******************************************************

}

// ******************************************************



jQuery(document).ready(function(){

    realTimeFunctions.create();

    realTimeFunctions.onLoadFunction = onLoadRealtime;

    setInterval(function(){

        realTimeFunctions.create();

    },50 * 1000);

	setTimeout(function(){

		const timelineContainer = document.querySelector('.timeline-container');

		if(typeof timelineContainer == 'undefined' || timelineContainer == null)
			return

		// Manejo del arrastre vertical
		let isDown = false;
		let startY;
		let scrollTop;

		timelineContainer.addEventListener('mousedown', (e) => {
			isDown = true;
			timelineContainer.classList.add('active');
			startY = e.pageY - timelineContainer.offsetTop;
			scrollTop = timelineContainer.scrollTop;
			timelineContainer.style.cursor = "grabbing";
		});

		timelineContainer.addEventListener('mouseleave', () => {
			isDown = false;
			timelineContainer.classList.remove('active');
			timelineContainer.style.cursor = "grab";
		});

		timelineContainer.addEventListener('mouseup', () => {
			isDown = false;
			timelineContainer.classList.remove('active');
			timelineContainer.style.cursor = "grab";
		});

		timelineContainer.addEventListener('mousemove', (e) => {
			if (!isDown) return; // Detiene la función si el mouse no está presionado
			e.preventDefault();
			const y = e.pageY - timelineContainer.offsetTop;
			const walk = (y - startY) * 2; // Multiplica el desplazamiento
			timelineContainer.scrollTop = scrollTop - walk; // Resta el desplazamiento
		});

		timelineContainer.addEventListener('touchstart', (e) => {
			isDown = true;
			startY = e.touches[0].pageY - timelineContainer.offsetTop;
			scrollTop = timelineContainer.scrollTop;
			timelineContainer.style.cursor = "grabbing";
		});

		timelineContainer.addEventListener('touchend', () => {
			isDown = false;
			timelineContainer.style.cursor = "grab";
		});

		timelineContainer.addEventListener('touchmove', (e) => {
			if (!isDown) return;
			e.preventDefault();
			const y = e.touches[0].pageY - timelineContainer.offsetTop;
			const walk = (y - startY) * 2; // Multiplica el desplazamiento
			timelineContainer.scrollTop = scrollTop - walk;
		});

		// Evita la selección de texto al arrastrar
		timelineContainer.addEventListener('mousedown', function (e) {
			e.preventDefault();
		});

    },5 * 1000);
    

});