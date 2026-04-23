// url structure:
// `https://sipd.kemendagri.go.id${BASE_URL}/?m=${nama_paket}`

// page id variable list / query parameter ?m=${nama_paket}
const renstra = {
  dashboard: "daerah_renstra_dashboard",
  final: {
    program: "daerah_renstra_final_manprokeg_beta",
  },
};

if (window.location.search.includes("renstra")) {
  console.clear();
}

async function backupRenstraFinal() {
  const perangkatDaerah = [];
  const BASE_URL = window.location.pathname;
  const headers = {
    Accept: "application/json, text/javascript, */*; q=0.01",
  };

  for (
    let page = 1, total = 1;
    total > perangkatDaerah.length && page <= 100;
    page++
  ) {
    await $.ajax({
      url: `${BASE_URL}?m=${renstra.final.program}&f=select_perangkat_daerah`,
      type: "POST",
      headers,
      data: {
        page,
      },
      success: (response) => {
        total = Number(response.total);
        if (total > perangkatDaerah.length) {
          perangkatDaerah.push(...response.results);
          console.log("Mendapatkan daftar Perangkat Daerah:", perangkatDaerah);
        }
      },
      error: (error) => {
        console.warn("Gagal mendapatkan data:", error);
        Swal.fire({
          title: "Error",
          text: `Gagal mendapatkan data: ${error}`,
          icon: "error",
        });
      },
    });
  }

  const dataProgram = [];

  for (
    let draw = 1, start = 0, recordsTotal = 1;
    recordsTotal > dataProgram.length && draw <= 100;
    draw++, start += 100
  ) {
    await $.ajax({
      url: `${BASE_URL}?m=${renstra.final.program}&f=datatable`,
      type: "POST",
      headers,
      data: {
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
        length: 100,
        "search[value]": "",
        "search[regex]": false,
        kodeskpd: "2.11.2.09.0.00.01.0000",
      },
      success: (response) => {
        recordsTotal = response.recordsTotal;
        if (recordsTotal > dataProgram.length) {
          dataProgram.push(...response.data);
          console.log("datatable:", dataProgram);
        }
      },
      error: (error) => {
        console.warn("Gagal mendapatkan data:", error);
        Swal.fire({
          title: "Error",
          text: `Gagal mendapatkan data: ${error}`,
          icon: "error",
        });
      },
    });
  }

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
              backupRenstraFinal();
            }
          });
        })
        .insertBefore(targetButton);
    }
  }
}
