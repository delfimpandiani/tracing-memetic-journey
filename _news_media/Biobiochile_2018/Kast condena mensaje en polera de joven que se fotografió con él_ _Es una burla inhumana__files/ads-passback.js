googletag.cmd.push(function () {

    var cantidad_estilos = 0;

    googletag.pubads().addEventListener('slotRenderEnded', function(event) {


        if ( document.querySelector('.contenedor-ad-top-sticky') != null && cantidad_estilos == 0) {
            // document.getElementById('header').classList.add("ad-top-sticky-active");

            document.head.insertAdjacentHTML("beforeend", '<style>.dark-mode #header{background-color:#14202a}.ad-top-sticky-active{padding-top:160px}.ad-top-sticky-active .contenedor-ad-top-sticky{position:fixed;top:0;z-index:1100;width:100%;border-bottom:1px solid rgba(3,12,38,.1)}</style>');

            cantidad_estilos ++
        }

        console.log('AD cargado: ' + event.slot.getSlotElementId());

        var id_banner = event.slot.getSlotElementId();
        var div_banner = document.getElementById('google_ads_iframe_/1098385/biobiocl/' + id_banner + '_0');

        if (id_banner.indexOf("ad_itt") > -1) {
            if (!event.isEmpty) {
                div_banner.style.width = "100%";
                div_banner.style.height = "100%";
                div_banner.style.position = "fixed";
                div_banner.style.zIndex = "99999";
                div_banner.style.top = "0px";
                div_banner.style.left = "0px";
            } 
        } 
        
        else if (id_banner.indexOf("ad_sticky_footer") > -1 ) {
            if (!event.isEmpty) {

                var contenedor_ad_sticky_footer = document.getElementById('contenedor_ad_sticky_footer');
                contenedor_ad_sticky_footer.style.display = "block";
                contenedor_ad_sticky_footer.style.position = "fixed";
                contenedor_ad_sticky_footer.style.bottom = "0px";
                contenedor_ad_sticky_footer.style.left = "50%";
                contenedor_ad_sticky_footer.style.transform = "translateX(-50%)";
                contenedor_ad_sticky_footer.style.zIndex = "99995";

                var ad_sticky_footer_cerrar = document.getElementById('ad_sticky_footer_cerrar');
                ad_sticky_footer_cerrar.style.position = "absolute";
                ad_sticky_footer_cerrar.style.top = "-30px";
                ad_sticky_footer_cerrar.style.left = "50%";
                ad_sticky_footer_cerrar.style.transform = "translateX(-50%)";
                ad_sticky_footer_cerrar.style.display = "flex";
                ad_sticky_footer_cerrar.style.alignItems = "center";
                ad_sticky_footer_cerrar.style.justifyContent = "center";
                ad_sticky_footer_cerrar.style.width = "245px";
                ad_sticky_footer_cerrar.style.height = "30px";
                ad_sticky_footer_cerrar.style.background = "rgba(255, 255, 255, 0.8)";
                ad_sticky_footer_cerrar.style.color = "rgb(105, 105, 105)";
                ad_sticky_footer_cerrar.style.borderRadius = "4px 4px 0px 0px";
                ad_sticky_footer_cerrar.style.fontSize = "14px";
                ad_sticky_footer_cerrar.style.cursor = "pointer";

                ad_sticky_footer_cerrar.addEventListener("click", function () {
                    document.getElementById('contenedor_ad_sticky_footer').style.display = "none";
                });
            }
        }
        
        
        
        
        
        else if (id_banner.indexOf("ad_sticky") > -1 ) {
            if (!event.isEmpty) {
                div_banner.style.position = "fixed";
                div_banner.style.width = "700px";
                div_banner.style.height = "100px";
                div_banner.style.zIndex = "99995";
                div_banner.style.bottom = "0px";

                div_banner.style.left = "0px";
                div_banner.style.right = "0px";
                div_banner.style.marginLeft = "auto";
                div_banner.style.marginRight = "auto";
            }
        } 
        
        
        
        
        
        else if (id_banner.indexOf("ad_top_sticky") > -1 ) {
            if (!event.isEmpty) {

                document.getElementById('header').classList.add("ad-top-sticky-active");

                let scrollBanner = true;
                let ad_top_sticky_ocultado = false;
                window.addEventListener('scroll', () => {
                    if (scrollBanner) {
                        if (window.top.scrollY > 0) {
                            scrollBanner = false;
                            setTimeout(() => {
                                document.getElementById('header').classList.remove("ad-top-sticky-active");
                                ad_top_sticky_ocultado = true;
                            }, 2000);
                        } 
                    }
                    if (ad_top_sticky_ocultado && window.top.scrollY == 0) {
                        document.getElementById('header').classList.add("ad-top-sticky-active");
                        ad_top_sticky_ocultado = false
                        scrollBanner = true
                    }
                });
            } else {
                document.getElementById('header').classList.remove("ad-top-sticky-active");
            }
        } 
    });
});