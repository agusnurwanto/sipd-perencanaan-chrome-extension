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
      getProgram: "datatable",
      getKegiatan: "datatable_kegiatan",
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
              alertError(jqXHR.status, textStatus, errorThrown);
              deferred.reject(jqXHR, textStatus, errorThrown);
            }
          });
      }

      sendRequest();
      return deferred.promise();
    }

    async function getDaftarPerangkatDaerah(delay = 500) {
      console.log("Mendapatkan daftar perangkat daerah...");
      const url = `${BASE_URL}?${nama_paket}=${renstra.final.program}&${action}=${actions.getPerangkatDaerah}`;
      const { results: daftarPerangkatDaerah, total } = await relayAjax({
        url,
        type: "POST",
        data: {
          page: 1,
        },
      });
      // const daftarPerangkatDaerah = [...results];
      console.log(`daftar perangkat daerah halaman 1:`, daftarPerangkatDaerah);

      const totalData = Number(total);
      const totalPages = Math.ceil(totalData / daftarPerangkatDaerah.length);

      if (totalPages > 1) {
        const promisesPagination = [];

        for (let page = 2; page <= totalPages; page++) {
          const newDelay = (page - 1) * delay;

          promisesPagination.push(
            new Promise((resolve) => setTimeout(resolve, newDelay)).then(() => {
              return relayAjax({
                url,
                type: "POST",
                data: {
                  page: page,
                },
                success: ({ results }) => {
                  console.log(
                    `daftar perangkat daerah halaman ${page}:`,
                    results,
                  );
                },
              });
            }),
          );
        }

        const promiseResponses = await Promise.all(promisesPagination);
        for (const { results } of promiseResponses) {
          daftarPerangkatDaerah.push(...results);
        }
      }

      console.log("Daftar Perangkat Daerah:", daftarPerangkatDaerah);
      return daftarPerangkatDaerah.map(({ id, text, uraiskpd }) => ({
        kodeskpd: id,
        textskpd: text,
        uraiskpd,
      }));
    }

    async function backupProgramRenstraFinal(
      daftarPerangkatDaerah,
      paginasi = 10,
      delay = 500,
    ) {
      const url = `${BASE_URL}?${nama_paket}=${renstra.final.program}&${action}=${actions.getProgram}`;
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
        };
      };

      for (const { kodeskpd, textskpd, uraiskpd } of daftarPerangkatDaerah) {
        console.log("Mendapatkan data Program Renstra Final:", textskpd);
        const { data, recordsTotal } = await relayAjax({
          url,
          type: "POST",
          data: payload(1, 0, paginasi, kodeskpd),
        });
        let dataProgram = [...data];
        console.log(`data program renstra final paginasi 1:`, data);

        const totalData = Number(recordsTotal);
        const dataLength = dataProgram.length;
        const totalDraw = Math.ceil(totalData / dataLength);

        if (dataLength < totalData) {
          const promisesPagination = [];

          for (
            let draw = 2, start = paginasi;
            draw <= totalDraw;
            draw++, start += paginasi
          ) {
            const newDelay = (draw - 1) * delay;

            promisesPagination.push(
              new Promise((resolve) => setTimeout(resolve, newDelay)).then(
                () => {
                  return relayAjax({
                    url,
                    type: "POST",
                    data: payload(draw, start, paginasi, kodeskpd),
                    success: ({ data }) => {
                      console.log(
                        `data program renstra final paginasi ${draw}:`,
                        data,
                      );
                    },
                  });
                },
              ),
            );
          }

          const promiseResponses = await Promise.all(promisesPagination);
          for (const { data } of promiseResponses) {
            dataProgram.push(...data);
          }
        }

        dataProgram = dataProgram.map(({ id, ...data }) => ({
          ...data,
          idoutcome: id,
          kodeskpd,
          textskpd,
          uraiskpd,
        }));

        const message = {
          message: {
            type: "get-url",
            content: {
              url: config.url_server_lokal,
              type: "post",
              data: dataProgram,
              return: false,
            },
          },
        };
        chrome.runtime.sendMessage(message, (response) => {
          console.log("responeMessage", response);
        });
        // console.log("Data Program Renstra Final:", dataProgram);
      }
      return dataProgram;
    }

    async function backupKegiatanRenstraFinal(dataProgram, paginasi = 10) {
      const url = `${BASE_URL}?${nama_paket}=${renstra.final.program}&${action}=${actions.getKegiatan}`;
      const payload = (
        draw,
        start,
        paginasi,
        kodeskpd,
        kodebidang,
        kodeprogram,
        idoutcome,
      ) => {
        return {
          draw,
          // draw: 1,
          "columns[0][data]": "no",
          "columns[0][name]": "",
          "columns[0][searchable]": false,
          "columns[0][orderable]": false,
          "columns[0][search][value]": "",
          "columns[0][search][regex]": false,
          "columns[1][data]": "uraikegiatan",
          "columns[1][name]": "uraikegiatan",
          "columns[1][searchable]": true,
          "columns[1][orderable]": true,
          "columns[1][search][value]": "",
          "columns[1][search][regex]": false,
          "columns[2][data]": "pagu1",
          "columns[2][name]": "pagu1",
          "columns[2][searchable]": false,
          "columns[2][orderable]": false,
          "columns[2][search][value]": "",
          "columns[2][search][regex]": false,
          "columns[3][data]": "pagu2",
          "columns[3][name]": "pagu2",
          "columns[3][searchable]": false,
          "columns[3][orderable]": false,
          "columns[3][search][value]": "",
          "columns[3][search][regex]": false,
          "columns[4][data]": "pagu3",
          "columns[4][name]": "pagu3",
          "columns[4][searchable]": false,
          "columns[4][orderable]": false,
          "columns[4][search][value]": "",
          "columns[4][search][regex]": false,
          "columns[5][data]": "pagu4",
          "columns[5][name]": "pagu4",
          "columns[5][searchable]": false,
          "columns[5][orderable]": false,
          "columns[5][search][value]": "",
          "columns[5][search][regex]": false,
          "columns[6][data]": "pagu5",
          "columns[6][name]": "pagu5",
          "columns[6][searchable]": false,
          "columns[6][orderable]": false,
          "columns[6][search][value]": "",
          "columns[6][search][regex]": false,
          "columns[7][data]": "",
          "columns[7][name]": "",
          "columns[7][searchable]": false,
          "columns[7][orderable]": false,
          "columns[7][search][value]": "",
          "columns[7][search][regex]": false,
          start,
          // start: 0,
          length: paginasi,
          // length: 10,
          "search[value]": "",
          "search[regex]": false,
          kodeskpd,
          // kodeskpd: "1.01.2.19.0.00.03.0000",
          kodebidang,
          // kodebidang: "1.01",
          kodeprogram,
          // kodeprogram: "1.01.01",
          idoutcome,
          // idoutcome: "98c68044-6638-11f0-aadc-622aabdf4862",
        };
      };

      for (const {
        kodeskpd,
        kodebidang,
        kodeprogram,
        idoutcome,
      } of dataProgram) {
        const { data, recordsTotal } = await relayAjax({
          url,
          type: "POST",
          data: payload(
            1,
            0,
            paginasi,
            kodeskpd,
            kodebidang,
            kodeprogram,
            idoutcome,
          ),
        });
        let dataKegiatan = [...data];
        console.log(`data kegiatan renstra final paginasi 1:`, data);

        const totalData = Number(recordsTotal);
        const dataLength = dataKegiatan.length;
        const totalDraw = Math.ceil(totalData / dataLength);

        if (dataLength < totalData) {
          const promisesPagination = [];

          for (
            let draw = 2, start = paginasi;
            draw <= totalDraw;
            draw++, start += paginasi
          ) {
            const newDelay = (draw - 1) * delay;

            promisesPagination.push(
              new Promise((resolve) => setTimeout(resolve, newDelay)).then(
                () => {
                  return relayAjax({
                    url,
                    type: "POST",
                    data: payload(
                      draw,
                      start,
                      paginasi,
                      kodeskpd,
                      kodebidang,
                      kodeprogram,
                      idoutcome,
                    ),
                  });
                },
              ),
            );
          }

          const promiseResponses = await Promise.all(promisesPagination);
          for (const { data } of promiseResponses) {
            dataKegiatan.push(...data);
          }
        }

        console.log(dataKegiatan);
      }
    }

    async function backupRenstraFinal() {
      const daftarPerangkatDaerah = await getDaftarPerangkatDaerah();
      console.log("test:", daftarPerangkatDaerah);
      // backupIndikatorProgramRenstraFinal(daftarPerangkatDaerah);
      // await backupProgramRenstraFinal(daftarPerangkatDaerah);
      // backupKegiatanRenstraFinal();
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
                  backupRenstraFinal();
                }
              });
            })
            .insertBefore(targetButton);
        }
      }
    }
  }
})();
