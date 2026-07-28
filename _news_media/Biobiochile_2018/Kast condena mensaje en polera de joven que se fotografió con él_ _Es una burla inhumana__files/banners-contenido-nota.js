function banners_contenido_nota(id, adname, post_number) {
	// PONER LA CLASE banners-contenido-nota-{ID} EN CONTENEDOR DEL CONTENIDO DE LA NOTA PARA QUE TODO FUNCIONE
	// console.log('me han llamado! ' + id + ' ' + adname)
	var id_notas_excluidas = [
		4750317,
		4929316
	];

	var contenido_nota = document.getElementsByClassName('banners-contenido-nota-' + id)[0];

	if ( typeof contenido_nota !== 'undefined' && !id_notas_excluidas.includes(id) ) {

		var parrafos = null
		
		try {   
		    parrafos = contenido_nota.querySelectorAll(':scope > p')
		} catch (ex) {
		    console.warn('banners-contenido-note: :scope not supported')
		    parrafos = contenido_nota.getElementsByTagName('p')
		}

		// var parrafos = contenido_nota.getElementsByTagName('p');
		var total_caracteres_parrafos = 0;
		var conteo_caracteres = 0;
		var banners_ubicados = 0;

		for (var i = 0; i < parrafos.length; i++) {
			total_caracteres_parrafos += parrafos[i].innerText.length;
		}

		if (parrafos.length > 0) {

			if (total_caracteres_parrafos < 1000) {

				if (id === 5092562) {
					insertar_banner_yarur(document.createElement('div'), parrafos[0], 'Nota_Unica', 1, id);
					// 300x250_Nota_Unica_1
				} else {
					insertar_banner(document.createElement('div'), parrafos[0], 1, id, post_number);

					if ( ['sociedad', 'tecnologia', 'cultura', 'espectaculos', 'vida', 'salud', 'turismo-y-viajes'].includes(adname) ) {
						insertar_ad_intext(id);
					}
				}
				
			} else {
				for (var i = 0; i < parrafos.length; i++) {
					if (banners_ubicados == 0) {

						if (id === 5092562) {
							insertar_banner_yarur(document.createElement('div'), parrafos[i], 'Nota_Unica', 1, id);
							// 300x250_Nota_Unica_1
						} else {
							insertar_banner(document.createElement('div'), parrafos[i], 1, id, post_number);

							if ( ['sociedad', 'tecnologia', 'cultura', 'espectaculos', 'vida', 'salud', 'turismo-y-viajes'].includes(adname) ) {
								insertar_ad_intext(id);
							}
						}

						conteo_caracteres = 0;
						banners_ubicados++;
					} else {
						conteo_caracteres += parrafos[i].innerText.length;
						if (conteo_caracteres >= 1000 && banners_ubicados == 1) {
							insertar_banner(document.createElement('div'), parrafos[i], 2, id, post_number);
							conteo_caracteres = 0;
							banners_ubicados++;
						} else if (conteo_caracteres >= 1000 && banners_ubicados == 2) {
							insertar_banner(document.createElement('div'), parrafos[i], 3, id, post_number);
							conteo_caracteres = 0;
							banners_ubicados++;
						}
					}
				}
			}
		}
	}
}

function insertar_banner(div_banner, elemento, num, id, post_number) {
	var float = num % 2 == 0 ? 'right' : 'left'
	div_banner.setAttribute('id', 'slot_box'  + num + '_esc_' + id);
	div_banner.setAttribute('style', 'display:none; width:300px; float: ' + float + '; margin-' + (float == 'right' ? 'left' : 'right') + ': 15px; margin-bottom: 15px;');
	
	if (elemento.parentElement.nodeName == 'BLOCKQUOTE') {
		elemento.parentElement.parentNode.insertBefore(div_banner, elemento.parentElement.nextSibling);
	} 
	else if(elemento.parentElement.classList.contains("post-excerpt")) {
		elemento.parentElement.parentNode.insertBefore(div_banner, elemento.parentElement.nextSibling)
	} 
	else {
		elemento.parentNode.insertBefore(div_banner, elemento);
	}

    console.log('Valor de post-scroll: ' + post_number + ' y el tipo: ' + typeof post_number)

    googletag.cmd.push(function() { 
		if (post_number != undefined) {
			googletag.defineSlot('/1098385/biobiocl/ad_box' + num, [300, 250], 'slot_box' + num + '_esc_' + id)
				.addService(googletag.pubads())
				.setTargeting('post-scroll', post_number);
		} else {
			googletag.defineSlot('/1098385/biobiocl/ad_box' + num, [300, 250], 'slot_box' + num + '_esc_' + id)
				.addService(googletag.pubads());
		}
		googletag.display('slot_box' + num + '_esc_' + id); 
	});
}

function insertar_banner_yarur(div_banner, elemento, adname, num, id) {
	var float = num % 2 == 0 ? 'right' : 'left'
	div_banner.setAttribute('id', '300x250_' + adname + '_' + id);
	div_banner.setAttribute('style', 'display:none; width:300px; float: ' + float + '; margin-' + (float == 'right' ? 'left' : 'right') + ': 15px; margin-bottom: 15px;');
	
	if (elemento.parentElement.nodeName == 'BLOCKQUOTE') {
		elemento.parentElement.parentNode.insertBefore(div_banner, elemento.parentElement.nextSibling);
	} 
	else if(elemento.parentElement.classList.contains("post-excerpt")) {
		elemento.parentElement.parentNode.insertBefore(div_banner, elemento.parentElement.nextSibling)
	} 
	else {
		elemento.parentNode.insertBefore(div_banner, elemento);
	}

	
	googletag.cmd.push(function() { 
		googletag.defineSlot('/1098385/300x250_' + adname, [300, 250], '300x250_' + adname + '_' + id).addService(googletag.pubads());
		googletag.display('300x250_' + adname + '_' + id); 
	});
}

function insertar_ad_intext(id) {
	var div_intext = document.createElement('div');
	div_intext.setAttribute('id', 'ad_intext_' + id);
	div_intext.setAttribute('style', 'display:none; min-width:300px; margin: 0 auto 15px;');
	document.querySelector('.banners-contenido-nota-' + id + ' > p:nth-of-type(3)').append(div_intext);

	googletag.cmd.push(function() { 
		googletag.defineSlot('/1098385/biobiocl/ad_intext', [1, 1], 'ad_intext_' + id)
			.addService(googletag.pubads());
		googletag.display('ad_intext_' + id); 
	});
}