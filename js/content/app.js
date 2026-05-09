(() => {
  if (
    ["renstra", "rpjmd", "rpjpd"].includes(
      window.location.pathname.split("/")[1],
    )
  ) {
    console.clear();
    if (new URL(config.sipd_url).pathname.endsWith("/")) {
      config.sipd_url = new URL(config.sipd_url).pathname;
    } else {
      config.sipd_url = `${new URL(config.sipd_url).pathname}/`;
    }
    if (config.sipd_url !== window.location.pathname) {
      console.log(
        `sipd_url pada config.js tidak sama dengan url sipd saat ini! mengganti sipd_url ke "${window.location.pathname}"`,
      );
      config.sipd_url = window.location.pathname;
    }
  }
})();
