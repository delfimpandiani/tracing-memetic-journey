(function() {
  const currentScriptSrc = document.currentScript.src

  window.addEventListener('load', async (event) => {

    const version = '0.17.2';
    const libraryUrl = `https://cdn.jsdelivr.net/npm/c2pa@${version}/+esm`;
    const { createC2pa, selectProducer, selectEditsAndActivity, selectSocialAccounts } = await import(libraryUrl);
    // cc-shadow.css and cr.svg must be beside this script
    const styleLocation = new URL('cc-shadow.css?v=3', currentScriptSrc); 
    const iconSvgLocation = new URL('cr.svg', currentScriptSrc)
  
    const c2pa = await createC2pa({
      wasmSrc: `https://cdn.jsdelivr.net/npm/c2pa@${version}/dist/assets/wasm/toolkit_bg.wasm`,
      workerSrc: `https://cdn.jsdelivr.net/npm/c2pa@${version}/dist/c2pa.worker.min.js`,
      downloaderOptions: { inspectSize: 65536 }
    });
    
    processImagesContainers(document.querySelectorAll('.wp-caption:not(.cc-processed), .cc-featured-image-container:not(.cc-processed)'));
  
    function processImagesContainers(imageContainers) {
  
      for (var imageContainer of imageContainers) {

        const src = imageContainer?.querySelector('img')?.src

        if (!src || !(new URL(src).hostname.includes('pixelstream.net'))) {
          continue
        }

        // this is an async operation. We don't use await to fetch credentials in parallel
        getImageContentCredentials(imageContainer, src);
      }
    }
  
    window.CONTENT_CREDENTIALS = {
      processImagesContainers
    }
    
    async function getImageContentCredentials(imageContainer, imageSrc) {
      
      const activeManifest = await getContentCredentials(c2pa, imageSrc);
      
      if (activeManifest) {
  
				imageContainer.classList.add('cc-processed')
        const container = document.createElement('div')
        container.classList.add('cc-container')
  
        const shadow = container.attachShadow({ mode: 'open', delegatesFocus: true });
        const styleLink = document.createElement('link');
        styleLink.setAttribute('rel', 'stylesheet');
        styleLink.setAttribute('href', styleLocation.href);
        shadow.appendChild(styleLink)

        const producer = selectProducer(activeManifest)?.name;
        const editsAndActivity = await selectEditsAndActivity(activeManifest, 'es-ES', 'light');
        const socialAccounts = await selectSocialAccounts(activeManifest);
        const title = activeManifest?.title || '';
        const signature = activeManifest?.signatureInfo || '';
        const claimGenerator = activeManifest?.claimGenerator?.split('/')[0].replaceAll('_', ' ') || "";

        const crButton = createCrIconButton();
        shadow.appendChild(crButton);

        const tooltip = createTooltip();
        shadow.appendChild(tooltip);

        const content = createContent(producer, claimGenerator, editsAndActivity, socialAccounts, title, signature, imageSrc);
        tooltip.appendChild(content);

        imageContainer.appendChild(container);
      }
    }
  
    function createCrIconButton() {
      const button = document.createElement('button');
      button.classList.add('cc-button');
      const icon = document.createElement('img');
      icon.classList.add('cc-cricon')
      icon.setAttribute('src', iconSvgLocation.href);
      button.appendChild(icon);
      return button;
    }
  
    function createTooltip() {
      const tooltip = document.createElement('div');
      tooltip.classList.add('cc-tooltip');
      tooltip.setAttribute('tabindex', 1);
      tooltip.setAttribute('role', 'tooltip');
			tooltip.style.opacity = 0
      return tooltip;
    }
  
    function createContent(producer, claimGenerator, editsAndActivity, socialAccounts, title, signature, url) {
      const content = document.createElement('div');
      content.classList.add('cc-content')
      
      const headerElement = document.createElement('h2');
      headerElement.innerText = 'Credenciales de Contenido';
      content.appendChild(headerElement);
      
      const signatureElement = document.createElement('p');
      signatureElement.innerText = `Enviado por ${signature.issuer}`;
      content.appendChild(signatureElement);
      
      const timeElement = document.createElement('p');
      timeElement.innerText = `Enviado el ${
        new Date(signature.time).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          weekday: 'long',
          day: '2-digit'
        })
      }`;
      content.appendChild(timeElement);
      
      const lineElement = document.createElement('div');
      lineElement.setAttribute('class', 'cc-line');
      content.appendChild(lineElement);
      
      const appElement = document.createElement('h3');
      appElement.innerText = 'Aplicación utilizada';
      content.appendChild(appElement);
      
      const claimGeneratorElement = document.createElement('div');
      claimGeneratorElement.innerText = claimGenerator;
      content.appendChild(claimGeneratorElement);
    
      if (producer) {
        const lineElement = document.createElement('div');
        lineElement.setAttribute('class', 'cc-line');
        content.appendChild(lineElement);
        
        const appElement = document.createElement('h3');
        appElement.innerText = 'Producido por';
        content.appendChild(appElement);
        
        const producerElement = document.createElement('div');
        producerElement.innerText = producer;
        content.appendChild(producerElement);
      }
  
      if (socialAccounts?.length > 0) {
        const lineElement = document.createElement('div');
        lineElement.setAttribute('class', 'cc-line');
        content.appendChild(lineElement);
        
        const headerElement = document.createElement('h3');
        headerElement.innerText = 'Redes sociales';
        content.appendChild(headerElement);
        socialAccounts.forEach(account => {
          const accountElement = document.createElement('div');
          accountElement.setAttribute('class', 'cc-icon-container');
          const accountIcon = document.createElement('img');
          accountIcon.setAttribute('src', getSocialIconFromUrl(account['@id']));
          accountIcon.setAttribute('class', 'cc-icon');
          accountElement.appendChild(accountIcon);
          const accountLink = document.createElement('a');
          accountLink.setAttribute('href', account['@id']);
          accountLink.setAttribute('target', '_blank');
          accountLink.innerText = account.name;
          accountElement.appendChild(accountLink);
          content.appendChild(accountElement);
        });
      }
  
      if (editsAndActivity?.length > 0) {
        const lineElement = document.createElement('div');
        lineElement.setAttribute('class', 'cc-line');
        content.appendChild(lineElement);
        
        const headerElement = document.createElement('h3');
        headerElement.innerText = 'Ediciones y actividad';
        content.appendChild(headerElement);
        editsAndActivity.forEach(edit => {
          console.log(edit);
  
          const editElement = document.createElement('div');
          editElement.setAttribute('class', 'cc-icon-container');
  
          if (edit.icon) {
            const editIcon = document.createElement('img');
            editIcon.setAttribute('src', edit.icon);
            editIcon.setAttribute('class', 'cc-icon');
            editElement.appendChild(editIcon);
          }
  
          const editLabel = document.createElement('span');
          editLabel.innerText = es.selectors.editsAndActivity[edit.id]?.label;
          editElement.appendChild(editLabel);
  
          content.appendChild(editElement);
          
          const descElement = document.createElement('div');
          descElement.setAttribute('class', 'cc-desc');
          descElement.innerText = es.selectors.editsAndActivity[edit.id]?.description;
          content.appendChild(descElement);
        });
      }
      
      const verifyLink = document.createElement('a');
      verifyLink.classList.add('cc-verify');
      verifyLink.setAttribute('target', '_blank');
      verifyLink.setAttribute('href', `https://verify.contentauthenticity.org/inspect?source=${url}`);
      verifyLink.innerText = 'Inspeccionar';
      content.appendChild(verifyLink);
    
      return content;
    }
    
    async function getContentCredentials(c2pa, url) {
      try {
        const { manifestStore } = await c2pa.read(url);
        const activeManifest = manifestStore?.activeManifest;
        return activeManifest;
      } catch (err) {
        console.error('Error reading image:', err);
        return null;
      }
    }
  
    function getSocialIconFromUrl(url) {
      if (url.includes('twitter')) {
        return 'https://biobio.pixelstream.com/assets/social/twitter.svg';
      } else if (url.includes('facebook')) {
        return 'https://biobio.pixelstream.com/assets/social/facebook.svg';
      } else if (url.includes('instagram')) {
        return 'https://biobio.pixelstream.com/assets/social/instagram.svg';
      } else {
        return null;
      }
    }

    const es = JSON.parse(`{
      "selectors": {
        "editsAndActivity": {
          "c2pa.color_adjustments": {
            "description": "Se han ajustado propiedades como el tono, la saturación, las curvas, las sombras o las luces",
            "label": "Ediciones de color o exposición"
          },
          "c2pa.converted": {
            "description": "El formato del recurso fue cambiado",
            "label": "Recurso convertido"
          },
          "c2pa.created": {
            "description": "Se ha creado un nuevo archivo o contenido",
            "label": "Fecha de creación"
          },
          "c2pa.cropped": {
            "description": "Se han usado herramientas de recorte, lo que reduce o expande el área de contenido visible",
            "label": "Ediciones de recorte"
          },
          "c2pa.drawing": {
            "description": "Se han usado herramientas como lápices, pinceles, borradores o herramientas de formas, trazados o bolígrafos",
            "label": "Ediciones de dibujo"
          },
          "c2pa.edited": {
            "description": "Se han hecho otros cambios",
            "label": "Otras ediciones"
          },
          "c2pa.filtered": {
            "description": "Se han usado herramientas como filtros, estilos o efectos para cambiar la apariencia",
            "label": "Ediciones de filtro o estilo"
          },
          "c2pa.opened": {
            "description": "Se ha abierto un archivo preexistente",
            "label": "Abierto"
          },
          "c2pa.orientation": {
            "description": "Se ha cambiado la posición u orientación (girado, volteado, etc.)",
            "label": "Ediciones de orientación"
          },
          "c2pa.placed": {
            "description": "Se ha añadido contenido preexistente a este archivo",
            "label": "Importado"
          },
          "c2pa.published": {
            "description": "Imagen recibida y distribuida",
            "label": "Imagen publicada"
          },
          "c2pa.removed": {
            "description": "Uno o más recursos fueron quitados del archivo",
            "label": "Recursos quitado"
          },
          "c2pa.repackaged": {
            "description": "El recurso fue reempaquetado sin ser procesado",
            "label": "Recurso reempaquetado"
          },
          "c2pa.resized": {
            "description": "Se han modificado las dimensiones o el tamaño del archivo",
            "label": "Ediciones de cambio de tamaño"
          },
          "c2pa.transcoded": {
            "description": "Recurso procesado o comprimido para optimizarlo para exhibición",
            "label": "Recurso procesado"
          },
          "c2pa.unknown": {
            "description": "Se han realizado otras ediciones o actividades que no se han podido reconocer",
            "label": "Ediciones o actividad desconocidas"
          }
        }
      }
    }`);
  
  })
})()
