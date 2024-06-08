// ==UserScript==
// @name        UltraDuck
// @namespace   UltraDuck
// @match       https://www.amazon.co.uk/vine/vine-items*
// @grant       GM.addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       GM_notification
// @require     include/keys.js
// @require     include/styles.js
// @require     include/hide.js
// @require     include/quacker.js
// @author      Jimbo
// @description Finds new items, and quacks
// @run-at      document-start
// @version     1.0.5
// ==/UserScript==

// Refresh settings
ultraDuckQuacker.minRefresh = 3000; // 3 seconds
ultraDuckQuacker.maxRefresh = 10000; // 10 seconds

// Notification settings
ultraDuckQuacker.showNotifications = true;
ultraDuckQuacker.showNotificationsOnRFY = true;
ultraDuckQuacker.showNotificationsOnAFA = true;
ultraDuckQuacker.showNotificationsOnAI = false;

/* To change the quack, use the following:
ultraDuckQuacker.quackSound = new Audio ('path/to/audio');
*/

// To change keyboard shortcuts, use ultraDuckKeys.shortcuts
ultraDuckKeys.shortcuts = {
    "rfy":          "r",
    "afa":          "a",
    "ai":           "i",
    "nextPage":     "n",
    "prevPage":     "p",
    "hideAll":      "h",
    "unhideAll":    "s",
    "page1ai":      "1",
    "page2ai":      "2",
    "page3ai":      "3",
    "page4ai":      "4",
    "page5ai":      "5",
    "page6ai":      "6",
    "page7ai":      "7",
    "page8ai":      "8",
    "page9ai":      "9",
    "page10ai":     "0",
};

//--------------------- Start script ---------------------//
// Apply thorvarium styles
ultraDuckStyle.applyThor();
// Hide items grid to prevent flicker
ultraDuckStyle.applyStyles('#vvp-items-grid { display:none !important; }');

// Now wait until the page is rendered
document.onreadystatechange = function() {
    if (document.readyState !== "interactive") {
        return false;
    }

    // Hit a snag, probably a Captcha or error page
    if (! document.getElementById('vvp-reviews-tab')) {
        console.log('❗🦆 Hit an unexpected page, aborting 🦆❗');
        ultraDuckQuacker.stop;
        return false;
    }

    // Check what page we're on
    queue = new URL(window.location).searchParams.get('queue')
    if (! queue) {
        queue = "last_chance";
    }

    // Only run hide-items on search page
    if (document.location.href.indexOf('search') >-1) {
        initHideItemsUK();
        return false;
    }

    // Run hide-items
    initHideItemsUK();

    // Register the focus/unfocus events
    window.addEventListener("blur", ultraDuckQuacker.run);
    window.addEventListener("focus", ultraDuckQuacker.pause);

    // Only run the check on a new page if it does not have focus, otherwise the user refreshed it manually.
    if(! document.hasFocus()) {
        ultraDuckQuacker.check();
        ultraDuckQuacker.run();
    }
}

