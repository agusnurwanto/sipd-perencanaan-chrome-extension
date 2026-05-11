try {
  importScripts(
    "/config.js",
    "js/background/bg-functions.js",
    "js/background/background.js",
    "js/background/ky.min.js",
  );
} catch (event) {
  console.log(event);
}
