/**
 * fetchModel - Fetch a model from the web server.
 * For CodeSandbox: fallback to local models when server unavailable.
 *
 * @param {string} url  The URL path to issue the GET request (e.g. "/user/list").
 * @returns {Promise}   Resolves with parsed JSON data, rejects on HTTP error.
 */
import models from "../modelData/models";

function fetchModel(url) {
  // Try server first, fallback to local models for CodeSandbox
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .catch((err) => {
      console.warn("Server unavailable, using local models:", err.message);
      
      // Fallback to local models
      if (url === "/user/list") {
        return Promise.resolve(models.userListModel());
      } else if (url.startsWith("/user/")) {
        const userId = url.split("/")[2];
        return Promise.resolve(models.userModel(userId));
      } else if (url.startsWith("/photosOfUser/")) {
        const userId = url.split("/")[2];
        return Promise.resolve(models.photoOfUserModel(userId));
      } else if (url === "/test/info") {
        return Promise.resolve(models.schemaInfo());
      }
      
      return Promise.reject(err);
    });
}

export default fetchModel;