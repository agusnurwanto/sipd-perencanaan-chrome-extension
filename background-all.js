try {
  importScripts(
    "/config.js",
    "js/background/promise.js",
    "js/background/bg-functions.js",
    "js/background/background.js",
    "js/ky.min.js",
  );
} catch(event) {
  console.log(event);
}
