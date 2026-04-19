/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url  The URL path to issue the GET request (e.g. "/user/list").
 * @returns {Promise}   Resolves with parsed JSON data, rejects on HTTP or network error.
 */
function fetchModel(url) {
  const fullUrl = `http://localhost:3002${url}`;
  return fetch(fullUrl).then((response) => {
    if (!response.ok) {
      return Promise.reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
    }
    return response.json();
  });
}

export default fetchModel;
