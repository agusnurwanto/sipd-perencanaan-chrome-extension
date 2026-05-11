function sendMessageAll(data, cb) {
  console.log("data", data);
  chrome.runtime.sendMessage(data, (response) => {
    if (typeof cb === "function") {
      cb(response);
    }
  });
}

function sendMessageTabActive(data, cb, nodebug) {
  if (!nodebug) {
    console.log("data", data);
  }
  if (data.tab) {
    chrome.tabs.sendMessage(data.tab.id, data, (response) => {
      if (typeof cb === "function") {
        cb(response);
      }
    });
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, data, (response) => {
        if (typeof cb === "function") {
          cb(response);
        }
      });
    });
  }
}

// https://stackoverflow.com/questions/46946380/fetch-api-request-timeout
function timeoutAjax(ms, promise) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("TIMEOUT"));
    }, ms);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((reason) => {
        clearTimeout(timer);
        reject(reason);
      });
  });
}

function relayAjax(options, retries = 20, delay = 10000, timeout = 9000000) {
  timeoutAjax(timeout, postData(options.url, options.data))
    .then((data) => {
      options.success(data);
    })
    .catch((error) => {
      console.log("pesan error", error);
      options.error();

      if (retries > 0) {
        console.log("Koneksi error. Coba lagi ", retries);
        setTimeout(() => {
          relayAjax(options, --retries, delay, timeout);
        }, delay);
      } else {
        console.log(
          "Capek. Sudah dicoba berkali-kali error terus. Maaf, berhenti mencoba.",
        );
      }
    });
}

const signal_all = {};

// https://stackoverflow.com/questions/31061838/how-do-i-cancel-an-http-fetch-request
function abortFetching(controller, url, action = "") {
  console.log("abortFetching!", url, action);
  controller.abort();
}

// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
function postData(url = "", data = {}) {
  const formdata = new FormData();

  for (const i in data) {
    if (typeof data[i] === "string") {
      const val = data[i];
    } else {
      const val = JSON.stringify(data[i]);
    }

    formdata.append(i, val);
  }

  if (!signal_all[url + data.action]) {
    signal_all[url + data.action] = [];
  } else {
    const controller = new AbortController();

    signal_all[url + data.action].push({
      controller: controller,
      signal: controller.signal,
    });

    // untuk mengcancel request sebelumnya agar tidak menumpuk di background
    if (data.action === "cek_lisensi_ext") {
      signal_all[url + data.action].map((b, i) => {
        abortFetching(b.controller, url, data.action);
      });
    }
  }

  const parameter = {
    method: "POST",
    signal: signal_all[url + data.action].signal,
    mode: "no-cors",
    cache: "no-cache",
    credentials: "include",
    redirect: "follow",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: formdata,
  };

  return fetch(url, parameter)
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      return data ? JSON.parse(data) : {};
    });
}
