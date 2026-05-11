chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("request", request);
  const type = request.message.type;

  if (type === "get-url") {
    relayAjax({
      url: request.message.content.url,
      type: request.message.content.type,
      data: request.message.content.data,
      dataType: "json",
      success: (ret) => {
        if (request.message.content.return) {
          // jika continue tidak kosong maka data akan dikirim secara terpisah agar terhindar dari limit makasimal
          if (request.message.content.continue && ret.data.length >= 1) {
            const ret_temp = ret;
            const _length = ret.data.length;

            ret.data.map((b, i) => {
              ret_temp.data = b;

              const options = {
                type: "response-fecth-url",
                data: ret_temp,
                tab: sender.tab,
                continue: request.message.content.continue,
                length: _length,
                no: i + 1,
              };

              if (request.message.content.resolve) {
                options.resolve = resolve;
              }

              if (i + 1 < _length) {
                sendMessageTabActive(options, "", true);
              } else {
                sendMessageTabActive(options);
              }
            });
          } else {
            const options = {
              type: "response-fecth-url",
              data: ret,
              tab: sender.tab,
            };

            if (request.message.content.resolve) {
              options.resolve = resolve;
            }

            sendMessageTabActive(options);
          }
        }
        console.log(ret);
      },
      error: () => {
        console.log("Error AJAX");
      },
    });
  }
  return sendResponse("THANKS from background!");
});
