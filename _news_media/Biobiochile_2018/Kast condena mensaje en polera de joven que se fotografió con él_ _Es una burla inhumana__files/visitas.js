function getVisits(id, axios) {
  const posts = JSON.parse(localStorage.getItem('bbcl-posts-visits')) || [];
  const postIndex = posts.findIndex((post) => post.id === id);

  if (postIndex === -1) {
    // CREAR ENTRADA
    return axios
      .get(
        'https://contador.biobiochile.cl/api/visitas/get-visitas?idNota=' + id
      )
      .then(function (data, err) {
        if (err) {
          throw err;
        }

        posts.push({
          id: id,
          lastTime: Date.now(),
        });

        if (posts.length > 20) {
          posts.shift();
        }

        localStorage.setItem('bbcl-posts-visits', JSON.stringify(posts));

        return data.data[0].Visitas.toLocaleString("es-CL");
      });
  } else if (posts[postIndex].lastTime + 60000 < Date.now()) {
    // ACTUALIZAR ENTRADA
    return axios
      .get(
        'https://contador.biobiochile.cl/api/visitas/get-visitas?idNota=' + id
      )
      .then(function (data, err) {
        if (err) {
          throw err;
        }

        posts[postIndex].lastTime = Date.now();
        localStorage.setItem('bbcl-posts-visits', JSON.stringify(posts));

        return data.data[0].Visitas.toLocaleString("es-CL");
      });
  } else {
    // NO SUMAR, SOLO MOSTRAR VISITA
    return axios
      .get(
        'https://contador.biobiochile.cl/api/visitas/get-visitas?idNota=' +
          id +
          '&nosumar=true'
      )
      .then(function (data, err) {
        if (err) {
          throw err;
        }

        return data.data[0].Visitas.toLocaleString("es-CL");
      });
  }
}
