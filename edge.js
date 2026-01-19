/**
 * ESA Edge Function Entry
 * Currently acts as a passthrough for the static site.
 * In the future, this can be used to handle API requests or server-side logic.
 */
async function handleRequest(request) {
  // fetch passes the request to the origin (or in this case, the static assets)
  return fetch(request);
}

export default {
  fetch(request) {
    return handleRequest(request);
  }
};