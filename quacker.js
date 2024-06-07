function initQuacker() {

    // Alert sound
    const alert_sound = new Audio ("https://github.com/Jimbo5431/UltraDuck/raw/main/quack.mp3");

    // Notification image
    const notification_image_url = "https://raw.githubusercontent.com/Jimbo5431/UltraDuck/main/rubber-duck.png";

    ////////////////////////////////////////////////////////////
    //                      Start script                      //
    ////////////////////////////////////////////////////////////

    const reload_interval = (Math.floor(Math.random() * ((max_refresh_int - min_refresh_int) * 1000)) + (min_refresh_int * 1000));
    const original_title = document.title;

    console.log('Delay: ' + reload_interval);

    let refresh_timeout;
    let title_interval;
    let new_load = true;

    window.addEventListener("blur", runScript);
    window.addEventListener("focus", pauseScript);

    if (! document.hasFocus()) {
        runScript();
        checkNew();
    }

    function flashTitle() {
        if (document.title === original_title){
            document.title = '* New Items *';
        } else {
            document.title = original_title;
        }
    }

    function stopFlashTitle() {
        clearInterval(title_interval);
        document.title = original_title;
        window.removeEventListener("focus", stopFlashTitle);
    }

    function runScript() {
        if ((! refresh_rfy && queue === "potluck") || (! refresh_afa && queue === "last_chance") || (! refresh_ai && queue === "encore")) {
            return false;
        }
        console.log('Tab is inactive. Setting timeout...');
        refresh_timeout = setTimeout(refreshMe, reload_interval);
//        if (new_load) {
//            checkNew();
//        }
    }

    function pauseScript() {
        console.log('Tab is active. Cancelling refresh...');
        clearTimeout(refresh_timeout);
    }

    function stopScript() {
        console.log('Stopping!');
        // Quack!!!
        alert_sound.play ();
        showNotif();
        clearTimeout(refresh_timeout);
        window.removeEventListener("blur", runScript);
        window.removeEventListener("focus", pauseScript);
        window.addEventListener("focus", stopFlashTitle);
        title_interval = setInterval(flashTitle, 750);
    }

    function checkNew() {
        new_load = false;
        console.log('Count: ' + (hiddenCount + filteredCount) + " / " + totalCount);
        if ((hiddenCount + filteredCount) === totalCount) {
            return true;
        }
        console.log('Found one');
        return stopScript();
    }

    function refreshMe() {
        console.log('Reloading!');
        location.reload();
    }

    function showNotif() {
        
        if (! show_notifications)
            return false;

        switch (queue) {
            case "last_chance":
                if (! show_notifications_on_afa)
                    return false;
                break;
            case "encore":
                if (! show_notifications_on_ai)
                    return false;
                break;
        }

        var page;
        switch(queue) {
            case 'encore':
                page = 'AI';
                break;
            case 'last_chance':
                page = 'AFA';
                break;
            case 'potluck':
                page = 'RFY';
                break;
        }

        GM_notification({
            text: "🦆🦆 quack quack 🦆🦆",
            title: "New item listed on " + page,
            image: notification_image_url,
            onclick: function() {
                window.parent.focus();
            }
        });
    }

}
