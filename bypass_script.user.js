// ==UserScript==
// @name         Pixeldrain Download Bypass
// @namespace    http://tampermonkey.net/
// @version      1.6.5
// @description  Bypass Pixeldrain Download Limit
// @author       MegaLime0, honey, Nurarihyon
// @match        https://pixeldrain.com/*
// @match        https://pixeldrain.net/*
// @match        https://cdn.pd8.workers.dev/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixeldrain.com
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/491326/Pixeldrain%20Download%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/491326/Pixeldrain%20Download%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const bypassUrl = "https://pd.1drv.eu.org/";
    const idRegex = /\/api\/file\/(\w+)\//;


    function getBypassUrls(urlType) {
        const currentUrl = window.location.href;

        if (urlType == "file") {
            const id = currentUrl.replace(`${location.origin}/u/`, "");
            const alteredUrl = bypassUrl + id;

            return alteredUrl;
        }

        if (urlType == "gallery") {
            const links = document.querySelectorAll('a.file');

            const bypassUrlList = [];
            const bypassUrlNames = [];

            links.forEach((link) => {
                const childDiv = link.querySelector('div');
                const backgroundUrl = childDiv.style.backgroundImage;

                const match = backgroundUrl.match(idRegex);

                if (match && match.length > 1) {
                    const alteredUrl = bypassUrl + match[1];
                    bypassUrlList.push(alteredUrl);
                    bypassUrlNames.push(link.textContent);
                }
            });

            return {bypassUrlList, bypassUrlNames};
        }
    }

    function handleButtonClick() {
        const currentUrl = window.location.href;

        if (currentUrl.includes(`${location.origin}/u/`)) {
            const alteredUrl = getBypassUrls("file");
            startDownload(alteredUrl);
        }

        if (currentUrl.includes(`${location.origin}/l/`)) {
            const links = getBypassUrls("gallery").bypassUrlList;

            links.forEach((link) => {
                startDownload(link)
            });
        }
    }

    function startDownload(link) {
          // GM_openInTab(link);  Old way of downloading
          const a = document.createElement("a");
          a.href = link;
          a.download = '';
          a.click();
    }

    function handleLinksButtonClick() {
        const popupBox = document.getElementById('popupBox');
        const popupClose = document.createElement('span');
        popupClose.innerHTML = '&times;';
        popupClose.style.position = 'absolute';
        popupClose.style.top = '1px';
        popupClose.style.right = '7px';
        popupClose.style.cursor = 'pointer';
        popupClose.onclick = function() {
            popupBox.style.display = 'none';
        };

        popupBox.innerHTML = '';
        popupBox.appendChild(popupClose);

        const currentUrl = window.location.href;

        if (currentUrl.includes(`${location.origin}/u/`)) {
            const alteredUrl = getBypassUrls("file");
            const urlElement = document.createElement("a");
            urlElement.href = alteredUrl;
            urlElement.textContent = alteredUrl;
            popupBox.appendChild(urlElement);
        }

        if (currentUrl.includes(`${location.origin}/l/`)) {
            let result = getBypassUrls("gallery");
            let bypassLinks = result.bypassUrlList;
            let bypassNames = result.bypassUrlNames;

            const linksContainer = document.createElement("div");
            linksContainer.style.maxHeight = "calc(100% - 40px)";
            linksContainer.style.overflowY = "auto";
            linksContainer.style.paddingBottom = "10px";

            bypassLinks.forEach((link) => {
                const urlElement = document.createElement("a");
                urlElement.href = link;
                urlElement.textContent = link;
                urlElement.style.display = "block";
                linksContainer.appendChild(urlElement);
            });

            popupBox.appendChild(linksContainer);

            popupBox.style.display = 'flex';
            popupBox.style.flexDirection = 'column';
            popupBox.style.alignItems = 'center';
            popupBox.style.justifyContent = 'center';

            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.justifyContent = 'center';
            buttonContainer.style.marginTop = '10px';

            const copyButton = document.createElement('button');
            copyButton.textContent = '🔗 Copy URL';
            copyButton.style.marginRight = '5px';
            copyButton.addEventListener('click', function() {
                const urls = bypassLinks.join('\n');
                navigator.clipboard.writeText(urls).then(function() {
                    copyButton.textContent = "✔️ Copied";
                    setTimeout(function() {
                        copyButton.textContent = '🔗 Copy URL';
                    }, 2500);
                }, function(err) {
                    console.error('Failed to copy URLs: ', err);
                });
            });
            buttonContainer.appendChild(copyButton);

            const saveButton = document.createElement('button');
            saveButton.textContent = '📄 Save as Text File';
            saveButton.style.marginLeft = '5px';
            saveButton.addEventListener('click', function() {
                const popupContent = document.getElementById('popupBox').querySelectorAll('a');
                if (popupContent.length > 0) {
                    const currentUrl = window.location.href;
                    const fileIdMatch = currentUrl.match(/\/l\/([^/#?]+)/);
                    if (fileIdMatch && fileIdMatch.length > 1) {
                        const fileId = fileIdMatch[1];
                        const fileName = fileId + '.txt';
                        let content = '';
                        popupContent.forEach((link) => {
                            content += link.href + '\n';
                        });
                        const blob = new Blob([content.trim()], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = fileName;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                    } else {
                        console.error('Failed to extract file identifier from URL.');
                    }
                } else {
                    console.error('Popup content not found.');
                }
            });
            buttonContainer.appendChild(saveButton);

            popupBox.appendChild(buttonContainer);
        }

        popupBox.style.display = 'block';
    }

    if (/pixeldrain\.(com|net)$/.test(window.location.hostname)) {
        const button = document.createElement("button");
        const downloadIcon = document.createElement("a");
        downloadIcon.className = "icon";
        downloadIcon.textContent = "download";
        downloadIcon.style.color = "#d7dde8";
        const downloadButtonText = document.createElement("span");
        downloadButtonText.textContent = "Download Bypass";
        button.appendChild(downloadIcon);
        button.appendChild(downloadButtonText);

        const linksButton = document.createElement("button");
        const linksIcon = document.createElement("i");
        linksIcon.className = "icon";
        linksIcon.textContent = "link";
        const linksButtonText = document.createElement("span");
        linksButtonText.textContent = "Show Bypass Links";
        linksButton.appendChild(linksIcon);
        linksButton.appendChild(linksButtonText);

        const popupBox = document.createElement("div");
        popupBox.style.zIndex = 20;
        popupBox.style.whiteSpace = "pre-line";
        popupBox.id = "popupBox";
        popupBox.style.display = "none";
        popupBox.style.position = "fixed";

        popupBox.style.top = "50%";
        popupBox.style.left = "50%";
        popupBox.style.transform = "translate(-50%, -50%)";
        popupBox.style.padding = "20px";
        popupBox.style.background = "#2f3541";
        popupBox.style.border = "2px solid #a4be8c";
        popupBox.style.color = "#d7dde8";
        popupBox.style.borderRadius = "10px";
        popupBox.style.width = "30%";
        popupBox.style.height = "90%";
        popupBox.style.maxWidth = "600px";

        button.addEventListener('click', handleButtonClick);
        linksButton.addEventListener('click', handleLinksButtonClick);

        const labels = document.querySelectorAll('div.label');
        labels.forEach(label => {
            if (label.textContent.trim() === 'Size') {
                const nextElement = label.nextElementSibling;
                if (nextElement) {
                    nextElement.insertAdjacentElement('afterend', linksButton);
                    nextElement.insertAdjacentElement('afterend', button);
                }
            }
        });

        document.body.appendChild(popupBox);

        function positionPopupBox(popupBox) {
            const popupRect = popupBox.getBoundingClientRect();
            popupBox.style.top = `calc(50% - ${popupRect.height / 2}px)`;
            popupBox.style.left = `calc(50% - ${popupRect.width / 2}px)`;
        }
    }
})();
