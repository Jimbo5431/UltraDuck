// ==UserScript==
// @name        UltraDuck
// @namespace   https://github.com/Jimbo5431/UltraDuck
// @run-at      document-start
// @match       https://www.amazon.co.uk/vine/vine-items
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_addStyle
// @grant       GM_listValues
// @grant       GM_notification
// @require     https://raw.githubusercontent.com/Jimbo5431/UltraDuck/main/deskthor.js
// @require     https://raw.githubusercontent.com/Jimbo5431/UltraDuck/main/mobilethor.js
// @require     https://raw.githubusercontent.com/Jimbo5431/UltraDuck/main/hideitems.js
// @require     https://raw.githubusercontent.com/Jimbo5431/UltraDuck/main/keypress.js
// @require     https://raw.githubusercontent.com/Jimbo5431/UltraDuck/main/quacker.js
// @version     0.03
// @description Hides items, auto refreshes, quacks and notifies.
// ==/UserScript==

// Add a style before the page loads to hide the product grid, to prevent the redraw being visible
GM_addStyle(`
#vvp-items-grid {
  display:none !important;
}

`);

document.onreadystatechange = function() {
    if (document.readyState !== "interactive")
        return false;

    // don't run on search page
    if (document.location.href.indexOf('search') >-1)
    {
        initKeys();
        return false;
    }

    queue = new URL(window.location).searchParams.get('queue')
    if (! queue)
        queue = "last_chance";

    if (navigator.userAgent.includes('Mobile'))
        GM_addStyle(mobileCSS());
    else
        GM_addStyle(deskCSS());

    initHideItemsUK();
    initKeys();
    initQuacker();
}
