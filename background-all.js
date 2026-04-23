try {
  importScripts(
    "/config.js",
    "js/background/promise.js",
    "js/background/bg-functions.js",
    "js/background/background.js"
  );
} catch(event) {
  console.log(event);
}