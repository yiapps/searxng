/* SPDX-License-Identifier: AGPL-3.0-or-later */
(function (w, d, searxng) {
  'use strict';

  searxng.ready(function () {
    searxng.image_thumbnail_layout = new searxng.ImageLayout('#urls', '#urls .result-images', 'img.image_thumbnail', 14, 6, 200);
    searxng.image_thumbnail_layout.watch();

    searxng.on('.btn-collapse', 'click', function () {
      var btnLabelCollapsed = this.getAttribute('data-btn-text-collapsed');
      var btnLabelNotCollapsed = this.getAttribute('data-btn-text-not-collapsed');
      var target = this.getAttribute('data-target');
      var targetElement = d.querySelector(target);
      var html = this.innerHTML;
      if (this.classList.contains('collapsed')) {
        html = html.replace(btnLabelCollapsed, btnLabelNotCollapsed);
      } else {
        html = html.replace(btnLabelNotCollapsed, btnLabelCollapsed);
      }
      this.innerHTML = html;
      this.classList.toggle('collapsed');
      targetElement.classList.toggle('invisible');
    });

    searxng.on('.media-loader', 'click', function () {
      var target = this.getAttribute('data-target');
      var iframe_load = d.querySelector(target + ' > iframe');
      var srctest = iframe_load.getAttribute('src');
      if (srctest === null || srctest === undefined || srctest === false) {
        iframe_load.setAttribute('src', iframe_load.getAttribute('data-src'));
      }
    });

    searxng.selectImage = function (resultElement) {
      /* eslint no-unused-vars: 0 */
      if (resultElement) {
        // load full size image in background
        const imgElement = resultElement.querySelector('.result-images-source img');
        const thumbnailElement = resultElement.querySelector('.image_thumbnail');
        const detailElement = resultElement.querySelector('.detail');
        if (imgElement) {
          const imgSrc = imgElement.getAttribute('data-src');
          if (imgSrc) {
            const loader = d.createElement('div');
            const imgLoader = new Image();

            loader.classList.add('loader');
            detailElement.appendChild(loader);

            imgLoader.onload = e => {
              imgElement.src = imgSrc;
              loader.remove();
            };
            imgLoader.onerror = e => {
              loader.remove();
            };
            imgLoader.src = imgSrc;
            imgElement.src = thumbnailElement.src;
            imgElement.removeAttribute('data-src');
          }
        }
      }
      d.getElementById('results').classList.add('image-detail-open');
      searxng.image_thumbnail_layout.align();
      searxng.scrollPageToSelected();
    }

    searxng.closeDetail = function (e) {
      d.getElementById('results').classList.remove('image-detail-open');
      searxng.image_thumbnail_layout.align();
      searxng.scrollPageToSelected();
    }
    searxng.on('.result-detail-close', 'click', e => {
      e.preventDefault();
      searxng.closeDetail();
    });
    searxng.on('.result-detail-previous', 'click', e => searxng.selectPrevious(false));
    searxng.on('.result-detail-next', 'click', e => searxng.selectNext(false));

    w.addEventListener('scroll', function () {
      var e = d.getElementById('backToTop'),
        scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
        results = d.getElementById('results');
      if (e !== null) {
        if (scrollTop >= 100) {
          results.classList.add('scrolling');
        } else {
          results.classList.remove('scrolling');
        }
      }
    }, true);

  });

})(window, document, window.searxng);
