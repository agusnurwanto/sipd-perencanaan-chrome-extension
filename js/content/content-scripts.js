chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.continue) {
    if (typeof data_temp_onmessage[request.continue] === "undefined") {
      data_temp_onmessage[request.continue] = [];
    }
    data_temp_onmessage[request.continue].push(request.data.data);

    if (request.no >= request.length) {
      request.data.data = data_temp_onmessage[request.continue];
    } else {
      return;
    }
  }
  console.log("sender, request", sender, request);

  if (request.type === "response-fecth-url") {
    const res = request.data;
    let _alert = true;
    let cek_hide_loading = true;

    if (res.action === "get_rpjpd") {
      _alert = false;
      open_modal_rpjpd(res.data);
    } else if (res.action === "singkron_rka") {
      if (!continue_singkron_rka[res.kode_sbl].alert) {
        _alert = false;
        cek_hide_loading = false;
      }

      if (!continue_singkron_rka[res.kode_sbl].no_resolve) {
        _alert = false;
        cek_hide_loading = false;

        continue_singkron_rka[res.kode_sbl].resolve(
          continue_singkron_rka[res.kode_sbl].next,
        );
      }
    } else if (res.action === "get_rpd") {
      cek_hide_loading = false;
      _alert = false;

      if (typeof continue_get_rpd !== "undefined") {
        continue_get_rpd(res.data);
      } else {
        open_modal_rpd(res.data);
      }
    } else if (res.action === "update_nonactive_sub_bl") {
      _alert = false;
      cek_hide_loading = false;
      promise_nonactive[res.id_unit]();
    } else if (res.action === "singkron_kategori_ssh") {
      _alert = false;
      cek_hide_loading = false;
      continue_kategori();
    } else if (res.action === "cek_lisensi_ext") {
      _alert = false;
      cek_hide_loading = false;

      if (res.run === "afterCekLisensi") {
        afterCekLisensi(res);
      }
    } else if (res.action === "cek_lisensi_ext_bn") {
      _alert = false;
      cek_hide_loading = false;

      if (res.run === "afterCekLisensi2") {
        afterCekLisensi2(res);
      }
    } else if (res.action === "get_usulan_ssh_sipd") {
      _alert = false;
      cek_hide_loading = false;
      singkron_ssh_dari_lokal(res);
    } else if (res.action === "singkron_apbd_per_jadwal") {
      _alert = false;
      cek_hide_loading = false;
      global_all_apbd[res.id_jadwal].resolve_reduce(nextData);
    } else if (res.action === "get_renja") {
      _alert = false;
      cek_hide_loading = false;

      if (res.run === "open_modal_renja") {
        open_modal_renja(res);
      } else if (res.run === "proses_modal_renja") {
        open_modal_renja(res, true);
      } else if (res.run === "proses_hapus_modal_renja") {
        proses_hapus_modal_renja(res, true);
      }
    }

    if (cek_hide_loading) {
      hide_loading();
    }

    if (_alert) {
      alert(res.message);
    }
  }

  return sendResponse("THANKS from content_script!");
});
