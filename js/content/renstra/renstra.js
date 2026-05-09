(() => {
  if (
    ["renstra", "rpjmd", "rpjpd"].includes(
      window.location.pathname.split("/")[1],
    )
  ) {
    const renstra = {
      dashboard: "daerah_renstra_dashboard",
      final: {
        program: "daerah_renstra_final_manprokeg_beta",
      },
    };

    const actions = {
      getPerangkatDaerah: "select_perangkat_daerah",
      getDataTable: "datatable",
    };

    const nama_paket = "m";
    const action = "f";

    const BASE_URL = config.sipd_url;
    const headers = {
      Accept: "application/json, text/javascript, */*; q=0.01",
    };

    function alertError(statusCode, textStatus, errorThrown) {
      console.log("Gagal mendapatkan data:", errorThrown);
      Swal.fire({
        title: "Error!",
        text: `Gagal mendapatkan data!`,
        icon: "error",
        footer: `<p>Status Code: ${statusCode}</p><p>Status Text: ${textStatus}</p><p></p><p>Error Thrown: ${errorThrown}</p>`,
      });
    }

    function relayAjax(
      url,
      data,
      retries = 3,
      // retries = 20,
      retryDelay = 1000,
      // retryDelay = 5000,
      timeout = 20000,
      // timeout = 1800000,
    ) {
      const deferred = jQuery.Deferred();
      const options = {
        url,
        type: "POST",
        headers,
        data,
        timeout,
      };

      function ajax() {
        jQuery
          .ajax(options)
          .done((data, textStatus, xhr) => {
            deferred.resolve(data, textStatus, xhr);
          })
          .fail((xhr, textStatus, errorThrown) => {
            if (textStatus === "timeout") {
              if (retries > 0) {
                console.log(
                  `Request timeout. Attempt: ${retries} left. Retrying...`,
                );
                retries--;

                setTimeout(() => {
                  ajax();
                }, retryDelay);
              } else {
                console.log(
                  "Permintaan gagal setelah percobaan beberapa kali, Maaf coba lagi nanti.",
                );
                deferred.reject(xhr, textStatus, errorThrown);
              }
            } else {
              if (xhr.status === 500) {
                alertError(xhr.status, textStatus, errorThrown);
              } else {
                alertError(xhr.status, textStatus, errorThrown);
              }
            }
          });
      }

      ajax();

      return deferred.promise();
    }

    function ajax(
      options,
      retries = 3,
      minRetryDelay = 1000,
      maxRetryDelay = 3000,
      timeout = 5000,
    ) {
      options = jQuery.extend(
        true,
        {
          headers,
          timeout,
        },
        options,
      );
      const deferred = jQuery.Deferred();

      function sendRequest() {
        jQuery
          .ajax(options)
          .done((data, textStatus, jqXHR) => {
            deferred.resolve(data, textStatus, jqXHR);
          })
          .fail((jqXHR, textStatus, errorThrown) => {
            if (retries > 0) {
              retries--;

              const delay =
                Math.floor(
                  Math.random() * (maxRetryDelay - minRetryDelay + 1),
                ) + minRetryDelay;

              console.log(
                `[AJAX Gagal] Status: ${textStatus}. Sisa retry: ${retries}. Mencoba ulang dalam ${delay}ms...`,
              );

              setTimeout(sendRequest(), delay);
            } else {
              console.log(
                `[AJAX Gagal] Maaf coba lagi nanti. Seluruh batas percobaan telah habis.`,
              );
              deferred.reject(jqXHR, textStatus, errorThrown);
            }
          });
      }

      sendRequest();
      return deferred.promise();
    }

    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function getDaftarOPD(delay = 500) {
      console.log("Mendapatkan daftar perangkat daerah...");
      const url = `${BASE_URL}?${nama_paket}=${renstra.final.program}&${action}=${actions.getPerangkatDaerah}`;
      const { results, total } = await ajax({
        url,
        type: "POST",
        data: {
          page: 1,
        },
      });

      let daftarPerangkatDaerah = [...results];
      const totalData = Number(total);
      const dataLength = daftarPerangkatDaerah.length;
      const totalPages = Math.ceil(totalData / dataLength);

      if (totalPages > 1) {
        const promiseData = [];

        for (let page = 2; page <= totalPages; page++) {
          const newDelay = (page - 1) * delay;

          promiseData.push(
            new Promise((resolve) => setTimeout(resolve, newDelay)).then(() => {
              return ajax({
                url,
                type: "POST",
                data: {
                  page: 1,
                },
              });
            }),
          );
        }

        const promiseResponses = await Promise.all(promiseData);
        promiseResponses.forEach(({ results }) => {
          daftarPerangkatDaerah = daftarPerangkatDaerah.concat(results);
        });
      }

      console.log("Daftar Perangkat Daerah:", daftarPerangkatDaerah);
      return daftarPerangkatDaerah;
    }

    async function getDaftarPerangkatDaerah(delay = 500) {
      const url = `${BASE_URL}?${nama_paket}=${renstra.final.program}&${action}=${actions.getPerangkatDaerah}`;
      const { results, total } = await relayAjax(url, { page: 1 });
      let daftarPerangkatDaerah = [...results];

      const totalData = Number(total);
      const dataLength = daftarPerangkatDaerah.length;
      const totalPages = Math.ceil(totalData / dataLength);

      if (totalPages > 1) {
        const promiseData = [];

        for (let page = 2; page <= totalPages; page++) {
          const newDelay = (page - 1) * delay;

          promiseData.push(
            new Promise((resolve) => setTimeout(resolve, newDelay)).then(() => {
              return relayAjax(url, { page });
            }),
          );
        }

        const promiseResponses = await Promise.all(promiseData);
        promiseResponses.forEach(({ results }) => {
          daftarPerangkatDaerah = daftarPerangkatDaerah.concat(results);
        });
      }

      console.log("Daftar Perangkat Daerah:", daftarPerangkatDaerah);
      return daftarPerangkatDaerah;
    }

    async function backupProgramRenstraFinal(paginasi = 10, delay = 500) {
      const url = `${BASE_URL}?${nama_paket}=${renstra.final.program}&${action}=${actions.getDataTable}`;
    }

    async function backupRenstraFinal(paginasi = 10, delay = 500) {
      const url = `${BASE_URL}?${nama_paket}=${renstra.final.program}&${action}=${actions.getDataTable}`;
      // const perangkatDaerah = await getDaftarPerangkatDaerah();
      const payload = (draw, start, paginasi, kodeskpd) => {
        return {
          draw,
          "columns[0][data]": "no",
          "columns[0][name]": "no",
          "columns[0][searchable]": false,
          "columns[0][orderable]": false,
          "columns[0][search][value]": "",
          "columns[0][search][regex]": false,
          "columns[1][data]": "urai",
          "columns[1][name]": "urai",
          "columns[1][searchable]": true,
          "columns[1][orderable]": true,
          "columns[1][search][value]": "",
          "columns[1][search][regex]": false,
          "columns[2][data]": "pagu_skpd1",
          "columns[2][name]": "pagu_skpd1",
          "columns[2][searchable]": true,
          "columns[2][orderable]": true,
          "columns[2][search][value]": "",
          "columns[2][search][regex]": false,
          "columns[3][data]": "pagu_skpd2",
          "columns[3][name]": "pagu_skpd2",
          "columns[3][searchable]": true,
          "columns[3][orderable]": true,
          "columns[3][search][value]": "",
          "columns[3][search][regex]": false,
          "columns[4][data]": "pagu_skpd3",
          "columns[4][name]": "pagu_skpd3",
          "columns[4][searchable]": true,
          "columns[4][orderable]": true,
          "columns[4][search][value]": "",
          "columns[4][search][regex]": false,
          "columns[5][data]": "pagu_skpd4",
          "columns[5][name]": "pagu_skpd4",
          "columns[5][searchable]": true,
          "columns[5][orderable]": true,
          "columns[5][search][value]": "",
          "columns[5][search][regex]": false,
          "columns[6][data]": "pagu_skpd5",
          "columns[6][name]": "pagu_skpd5",
          "columns[6][searchable]": true,
          "columns[6][orderable]": true,
          "columns[6][search][value]": "",
          "columns[6][search][regex]": false,
          "columns[7][data]": "",
          "columns[7][name]": "",
          "columns[7][searchable]": false,
          "columns[7][orderable]": false,
          "columns[7][search][value]": "",
          "columns[7][search][regex]": false,
          start,
          length: paginasi,
          "search[value]": "",
          "search[regex]": false,
          kodeskpd,
          // kodeskpd: "2.11.2.09.0.00.01.0000",
        };
      };
      const { data, recordsTotal } = await relayAjax(
        url,
        payload(1, 0, paginasi, "2.11.2.09.0.00.01.0000"),
      );
      let dataProgram = [...data];

      const totalData = Number(recordsTotal);
      const dataLength = dataProgram.length;
      const totalDraw = Math.ceil(totalData / dataLength);

      if (dataLength < totalData) {
        const promiseData = [];
        for (
          let draw = 2, start = paginasi;
          draw <= totalDraw;
          draw++, start += paginasi
        ) {
          const newDelay = (draw - 1) * delay;

          promiseData.push(
            sleep(newDelay).then(() => {
              return relayAjax(
                url,
                payload(draw, start, paginasi, "2.11.2.09.0.00.01.0000"),
              );
            }),
          );

          const promiseResponses = await Promise.all(promiseData);
          promiseResponses.forEach(({ data }) => {
            dataProgram = dataProgram.concat(data);
          });
        }
      }

      console.log("Data Program:", dataProgram);
      return dataProgram;

      // for (
      //   let draw = 1, start = 0, recordsTotal = 1;
      //   recordsTotal > dataProgram.length && draw <= 100;
      //   draw++, start += paginasi
      // ) {
      //   await $.ajax({
      //     url,
      //     type: "POST",
      //     headers,
      //     data: {
      //       draw,
      //       "columns[0][data]": "no",
      //       "columns[0][name]": "no",
      //       "columns[0][searchable]": false,
      //       "columns[0][orderable]": false,
      //       "columns[0][search][value]": "",
      //       "columns[0][search][regex]": false,
      //       "columns[1][data]": "urai",
      //       "columns[1][name]": "urai",
      //       "columns[1][searchable]": true,
      //       "columns[1][orderable]": true,
      //       "columns[1][search][value]": "",
      //       "columns[1][search][regex]": false,
      //       "columns[2][data]": "pagu_skpd1",
      //       "columns[2][name]": "pagu_skpd1",
      //       "columns[2][searchable]": true,
      //       "columns[2][orderable]": true,
      //       "columns[2][search][value]": "",
      //       "columns[2][search][regex]": false,
      //       "columns[3][data]": "pagu_skpd2",
      //       "columns[3][name]": "pagu_skpd2",
      //       "columns[3][searchable]": true,
      //       "columns[3][orderable]": true,
      //       "columns[3][search][value]": "",
      //       "columns[3][search][regex]": false,
      //       "columns[4][data]": "pagu_skpd3",
      //       "columns[4][name]": "pagu_skpd3",
      //       "columns[4][searchable]": true,
      //       "columns[4][orderable]": true,
      //       "columns[4][search][value]": "",
      //       "columns[4][search][regex]": false,
      //       "columns[5][data]": "pagu_skpd4",
      //       "columns[5][name]": "pagu_skpd4",
      //       "columns[5][searchable]": true,
      //       "columns[5][orderable]": true,
      //       "columns[5][search][value]": "",
      //       "columns[5][search][regex]": false,
      //       "columns[6][data]": "pagu_skpd5",
      //       "columns[6][name]": "pagu_skpd5",
      //       "columns[6][searchable]": true,
      //       "columns[6][orderable]": true,
      //       "columns[6][search][value]": "",
      //       "columns[6][search][regex]": false,
      //       "columns[7][data]": "",
      //       "columns[7][name]": "",
      //       "columns[7][searchable]": false,
      //       "columns[7][orderable]": false,
      //       "columns[7][search][value]": "",
      //       "columns[7][search][regex]": false,
      //       start,
      //       length: paginasi,
      //       "search[value]": "",
      //       "search[regex]": false,
      //       kodeskpd: "2.11.2.09.0.00.01.0000",
      //     },
      //     success: (response) => {
      //       recordsTotal = response.recordsTotal;
      //       if (recordsTotal > dataProgram.length) {
      //         dataProgram.push(...response.data);
      //         console.log("datatable:", dataProgram);
      //       }
      //     },
      //     error: (error) => {
      //       console.warn("Gagal mendapatkan data:", error);
      //       Swal.fire({
      //         title: "Error",
      //         text: `Gagal mendapatkan data: ${error}`,
      //         icon: "error",
      //       });
      //     },
      //   });
      // }

      // return perangkatDaerah;
    }

    if (window.location.search.includes(renstra.final.program)) {
      const targetButton = $(
        "#bs-example-navbar-collapse-1 > ul > li:nth-child(1)",
      );

      if (targetButton.length !== 0) {
        if ($("#wpsipd-backup-renstra-final").length === 0) {
          $(
            '<li id="wpsipd-backup-renstra-final"><a href="#"><i class="fa fa-upload"></i> Backup Data ke WP-SIPD</a></li>',
          )
            .on("click", () => {
              Swal.fire({
                title: "Backup Data Renstra Final?",
                text: "Apakah Anda yakin ingin melakukan backup data Program, Kegiatan, Sub Kegiatan Renstra Final ke WP-SIPD?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Ya, Backup Sekarang!",
                footer: `<p>URL Admin AJAX WP-SIPD:</p><a href="${config.url_server_lokal}" target="_blank">${config.url_server_lokal}</a>`,
              }).then((result) => {
                if (result.isConfirmed) {
                  // backupRenstraFinal();
                  // getDaftarPerangkatDaerah();
                  getDaftarOPD();
                }
              });
            })
            .insertBefore(targetButton);
        }
      }
    }
  }
})();
