"use strict";

/* =========================================================
   POWER GAMING 7972
   Download Counter
========================================================= */

const initDownloadCounter = () => {

  const downloadButtons =
    document.querySelectorAll(".download-btn");

  const counterElements =
    document.querySelectorAll(
      "#downloads, .download-count"
    );

  /* Get saved download count */
  const getDownloadCount = () => {
    const saved =
      localStorage.getItem("downloads");

    const count = Number(saved);

    return Number.isFinite(count)
      ? count
      : 0;
  };


  /* Save download count */
  const setDownloadCount = (count) => {
    localStorage.setItem(
      "downloads",
      String(count)
    );
  };


  /* Update counters on page */
  const updateCounters = (count) => {

    counterElements.forEach(
      (element) => {
        element.textContent =
          count.toLocaleString();
      }
    );
  };


  /* Initial counter */
  let downloadCount =
    getDownloadCount();

  updateCounters(
    downloadCount
  );


  /* Download button clicks */
  downloadButtons.forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          downloadCount =
            getDownloadCount() + 1;

          setDownloadCount(
            downloadCount
          );

          updateCounters(
            downloadCount
          );

        }
      );

    }
  );

};


/* ===========================
   Start
=========================== */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initDownloadCounter,
    { once: true }
  );

} else {

  initDownloadCounter();

}