/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url  The URL path to issue the GET request (e.g. "/user/list").
 * @returns {Promise}   Resolves with parsed JSON data, rejects on HTTP error.
 */
function fetchModel(url) {
  return fetch(url).then((response) => {
    if (!response.ok) {
      return Promise.reject(
        new Error(`HTTP ${response.status}: ${response.statusText}`)
      );
    }
    return response.json();
  });
}

export default fetchModel;
