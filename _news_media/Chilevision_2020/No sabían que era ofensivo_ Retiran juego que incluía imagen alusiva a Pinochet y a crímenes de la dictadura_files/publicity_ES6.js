/** Helpers **/

const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
/** Mappings de tamaños según ID */

const SIZE_MAPPINGS = {

    Box: [

        [[992, 0], [[300, 250], [336, 280]]],
        [[768, 0], [[300, 250], [336, 280]]],
        [[320, 0], [[300, 250], [336, 280]]],
        [[0, 0], [[300, 250], [336, 280]]]

    ],
    Top3: [

        [[992, 0], [[728, 90], [728, 180], [728, 250]]],
        [[768, 0], [[728, 90], [728, 180], [728, 250]]],
        [[320, 0], [[320, 100], [320, 50], [300, 100], [300, 50]]],
        [[0, 0], [[320, 100], [320, 50], [300, 100], [300, 50]]]

    ],
    Top: [

        [[992, 0], [[728, 90], [960, 90], [960, 180], [960, 250], [970, 90], [970, 250]]],
        [[768, 0], [[728, 90]]],
        [[320, 0], [[320, 100], [320, 50], [300, 100], [300, 50]]],
        [[0, 0], [[320, 100], [320, 50], [300, 100], [300, 50]]]

    ],
    Lateral: [

        [[992, 0], [[120, 600], [160, 600]]],
        [[768, 0], [[120, 600], [160, 600]]],
        [[320, 0], []],
        [[0, 0], []]

    ]

};
/** Construye mapping desde SIZE_MAPPINGS */

const buildMapping = (id) => {

    const key = Object.keys(SIZE_MAPPINGS).find(k => id.includes(k));
    if (!key) return null;
    return SIZE_MAPPINGS[key].reduce((map, [size, dims]) => {

        return map.addSize(size, dims);
    }, googletag.sizeMapping()).build();
};
/** Determinar targeting de categoría */

const resolveCategoryTargeting = () => {

    if (global_section === "single") return global_post_categories[0].slug;
    if (global_section === "category") return glogal_post_category;
    if (global_section === "search") {

        return {

            author: "autor",
            tag: "tags"

        }[global_post_search] || "buscador";
    }

    return "portada";
};
/** Determinar sección */

const resolveSection = () => ({

    single: "articulo",
    category: "portada",
    search: "portada"

}[global_section] || global_section);
/***************************

 *  CARGA DE PUBLICIDAD

 ***************************/

function cargarPublicidad() {

    var url = ['/page/corporativo', '/chv-presenta'];
    if (typeof global_post_segment_url !== 'undefined' && url.some(item => global_post_segment_url.includes(item))) return;

    console.log('*****publicidad*****');
    
    if (global_section === "single" && post_noAds === '1') return;
    if (!qs(".rtb_slot") || typeof googletag === "undefined") return;

    googletag.cmd.push(() => {

        const nuevosSlots = [];

        // if (global_section === "single") add_box_ads_content();
        qsa(".rtb_slot:not(.loaded):not(.only-focus)").forEach(slotEl => {

            slotEl.classList.add("loaded");
            const { slot, adunit: id, dimensions, oop = 'false' } = slotEl.dataset;

            if (slot && slot.endsWith('/')) {
                return; // equivalente a "continue"
            }

            if (slot && slot.includes("mow_chilevision.cl")) {
                return; // equivalente a continue
            }

            const dims = JSON.parse(dimensions || "[]");
            const mappingSize = buildMapping(id);
            /** Skeleton **/

            // console.log(oop);

            const prev = slotEl.previousElementSibling;
            if (prev?.classList.contains("ad-skeleton")) {

                const skeletonId = `adSkeleton_${id.replace(/\W+/g, "_")}`;
                prev.id = skeletonId;
                slotEl.dataset.skeletonId = skeletonId;
            }

            /** Contenedor del slot */

            const slotDiv = document.createElement("div");
            slotDiv.id = id;
            slotEl.innerHTML = "";
            slotEl.appendChild(slotDiv);
            /** Define slot */

            const slotAds =  oop == 'true' ? googletag.defineOutOfPageSlot(slot, id) : googletag.defineSlot(slot, dims, id);

            if (mappingSize) slotAds.defineSizeMapping(mappingSize);
            slotAds

                .setTargeting("tipo", resolveSection())

                .setTargeting("category-primary", resolveCategoryTargeting())

                // .setTargeting('adtest', dfpAdTest)
                // .setTargeting('amp', 'false')    
                // .setTargeting('app', 'false')
                // .setTargeting('appname', 'none')    
                // .setTargeting('cat', dfpContentType)
                // .setTargeting('contentid', dfpContentId)
                // .setTargeting('contenttitle', dfpContentTitle)
                // .setTargeting('hl', dfpHL)
                // .setTargeting('page', dfpPage)
                // .setTargeting('screensize', dfpResolution)
                // .setTargeting('sect', dfpSect)
                // .setTargeting('show', dfpShow)
                // .setTargeting('site', dfpSite)
                // .setTargeting('sub', dfpSub)
                // .setTargeting('test', dfpEnv)   
                // .setTargeting('theme', 'ge')
                // .setTargeting('type', dfpType)
                // .setTargeting('dfpPath', dfpPath)
                // .setTargeting('transactionIDStatus', 'false'); 

                .addService(googletag.pubads());
            /** Servicios generales */

            const pubads = googletag.pubads();
            pubads.enableSingleRequest();
            pubads.setCentering(true);
            pubads.enableLazyLoad({ 
                fetchMarginPercent: 200,  // Traer el anuncio cuando falten 2 pantallas
                renderMarginPercent: 100, // Renderizar cuando falte 1 pantalla
                mobileScaling: 2.0 });
            pubads.set("page_url", "https://www.chilevision.cl/");
            googletag.enableServices();
            /** Ocultar skeleton al renderizar */

           pubads.addEventListener("slotRenderEnded", ev => {

                if (ev.slot.getSlotElementId() === "ad_sticky" && !ev.isEmpty) showSticky();
                // Si el slot está vacío → NO ocultar el skeleton

                if (ev.isEmpty) return;
                // ID del div donde googletag colocó el anuncio (puede ser el id que asignaste al inner div)

                const slotDivId = ev.slot.getSlotElementId();
                let skeletonId;
                if (slotDivId) {

                    // Obtener el elemento donde se desplegó el anuncio

                    const slotDiv = document.getElementById(slotDivId);
                    // Si el div existe, buscamos su .rtb_slot contenedor (puede ser el mismo o el padre)

                    const rtbContainer = slotDiv?.closest?.(".rtb_slot");
                    // Leemos el data-skeleton-id directamente del contenedor

                    skeletonId = rtbContainer?.dataset?.skeletonId;
                }

                // Fallback: si no encontramos por slotDivId, intentamos localizar el rtb_slot por adUnitPath

                if (!skeletonId) {

                    const slotElement = document.querySelector(`.rtb_slot[data-slot="${ev.slot.getAdUnitPath()}"]`);
                    skeletonId = slotElement?.dataset?.skeletonId;
                }

                // Si tenemos skeletonId, lo buscamos por ID y lo ocultamos

                if (skeletonId) {

                    const skeletonEl = document.getElementById(skeletonId);
                    if (skeletonEl) skeletonEl.classList.add("hidden");
                }

            });

            nuevosSlots.push(slotAds);

            googletag.cmd.push(() => googletag.display(id));
        });

        // REFRESCAR SOLO LOS NUEVOS SLOTS
        if (nuevosSlots.length > 0) {
            googletag.pubads().refresh(nuevosSlots);
        }

    });
}

/***************************

 *  ADS EN CONTENIDO IA

 ***************************/

function add_box_ads_content() {

    const INVALID_PARENTS = [

        "blockquote",
        "figure",
        "iframe",
        "pre",
        "code",
        "embed",
        "twitter-widget",
        "instagram-media",
        "fb-post"

    ];
    const isValidAdPlacement = (p) => {

        if (!p || p.tagName.toLowerCase() !== "p") return false;
        let parent = p.parentElement;
        while (parent) {

            const tag = parent.tagName?.toLowerCase?.();
            if (!tag) break;
            if (INVALID_PARENTS.includes(tag)) {

                return false;
            }

            parent = parent.parentElement;
        }

        return true;
    };
    const elements = qsa(".main-single__text");
    const createBanner = () => {

        const cont = document.createElement("div");
        cont.className = "u-the-banner | all:my-end-32";
        // const span = document.createElement("span");
        // span.className = "main-highlight-banner__title";
        // span.textContent = "Publicidad";
        // cont.appendChild(span);
        return cont;
    };
    const baseAd = document.createElement("div");
    baseAd.className = "rtb_slot";
    baseAd.dataset.dimensions = "[[300, 250]]";
    baseAd.dataset.section = "single_page";
    elements.forEach(el => {

        if (el.classList.contains("ads_content_succes")) return;
        el.classList.add("ads_content_succes");
        const id_post = el.querySelector(".post_id_by_ads")?.value || Date.now();
        const paragraphs = qsa("p", el).filter(isValidAdPlacement);
        if (!paragraphs.length) return;
        const insertAt = Math.ceil(paragraphs.length / 2);
        let count = 0;
        let inserted = false;
        paragraphs.forEach(p => {

            count++;
            if (count === insertAt && !inserted) {

                inserted = true;
                const banner = createBanner();
                const ad = baseAd.cloneNode(true);
                ad.dataset.slot = "/1047933/chilevision/Nota_Noticias_";
                ad.dataset.adunit = `300X250_B_${id_post}`;
                banner.appendChild(ad);
                p.parentNode.insertBefore(banner, p.nextSibling);
            }

        });
    });
}


function hide_banner(){

   qsa(".u-the-banner").forEach(bannerDiv => {

        bannerDiv.style.display = 'none';
   })

}

document.addEventListener("DOMContentLoaded", function(event) {
    cargarPublicidad();
});