class ultraDuckQuacker {
    static quackSoundUrl = 'https://github.com/Jimbo5431/UltraDuck/raw/main/quack.mp3';
    static honkSoundUrl = 'https://github.com/Jimbo5431/UltraDuck/raw/main/honk.mp3';
    static quackImage = 'https://raw.githubusercontent.com/Jimbo5431/UltraDuck/main/rubber-duck.png';
    static minRefresh = 3000; // 3 Seconds
    static maxRefresh = 10000; // 10 Seconds
    static delay = Math.floor(Math.random () * (ultraDuckQuacker.maxRefresh - ultraDuckQuacker.minRefresh)) + ultraDuckQuacker.minRefresh;
    static refreshTimer = null;
    static runOnRFY = true;
    static runOnAFA = true;
    static runOnAI = true;
    static allStop = false;
    static hiddenCount = 0;
    static filteredCount = 0;
    static totalCount = 0;
    static originalTitle = document.title;
    static showNotifications = true;
    static showNotificationsOnRFY = true;
    static showNotificationsOnAFA = true;
    static showNotificationsOnAI = false;
    static titleInterval = null;

    static checkStop() {
        if (ultraDuckQuacker.allStop || GM_getValue('UltraDuckStop', false)) {
            return true;
        }
        return false;
    }

    static honk() {
        ultraDuckQuacker.stop();
        console.log('❗🦢 Hit an unexpected page, aborting 🦢❗');
        GM_setValue('UltraDuckStop', true);
        console.log('🛑 🦢 HONK!!!!! 🦢 🛑');
        let honkSound = new Audio(ultraDuckQuacker.honkSoundUrl);
        honkSound.play();
    }
    static quack() {
        let quackSound = new Audio(ultraDuckQuacker.quackSoundUrl);
        ultraDuckQuacker.stop();
        console.log('🛑 🦆 Quack! 🦆 🛑');
        quackSound.play();
        window.addEventListener("focus", ultraDuckQuacker.stopFlashTitle);
        ultraDuckQuacker.showNotif();
        ultraDuckQuacker.flashTitle();
        ultraDuckQuacker.titleInterval = setInterval(ultraDuckQuacker.flashTitle, 500);
    }

    // Check if we should run quacker
    static runCheck() {
        if(document.location.href.indexOf('search') >-1) {
            return false;
        }
        if((!ultraDuckQuacker.runOnAFA) && queue === 'last_chance') {
            return false;
        }
        if ((!ultraDuckQuacker.runOnAI) && queue === 'encore') {
            return false;
        }
        if ((!ultraDuckQuacker.runOnRFY) && queue === 'potluck') {
            return false;
        }
        return true;
    }

    static run() {
        console.log('💨🦆 Duck is running 🦆💨');
        ultraDuckQuacker.refresh();
    }

    static pause() {
        console.log('⏸🦆 Duck is paused 🦆⏸');
        if(ultraDuckQuacker.refreshTimer !== null) {
            console.log('🛑 🦆 Refresh stopped 🦆 🛑');
            clearTimeout(ultraDuckQuacker.refreshTimer);
        }
    }

    static stop() {
        console.log('🛑 🦆 Stopping 🦆 🛑');
        ultraDuckQuacker.allStop = true;
        if(ultraDuckQuacker.refreshTimer !== null) {
            console.log('🛑 🦆 Refresh stopped 🦆 🛑');
            clearTimeout(ultraDuckQuacker.refreshTimer);
        }
        window.removeEventListener('blur', ultraDuckQuacker.run);
        window.removeEventListener('focus', ultraDuckQuacker.pause);
    }

    static refresh() {
        if(ultraDuckQuacker.checkStop()) {
            console.log('🦆 Ignoring refresh, page stopped 🦆');
            return false;
        }
        ultraDuckQuacker.refreshTimer = setTimeout(ultraDuckQuacker.refreshTimeout, ultraDuckQuacker.delay);
        console.log('🦆 Refresh timer: ' + ultraDuckQuacker.delay + 'ms 🦆');
    }

    static refreshTimeout() {
        if(ultraDuckQuacker.checkStop()) {
            console.log('🦆 Ignoring refresh, page stopped 🦆');
            return false;
        }
        window.location.reload();
    }
    static check() {
        if(ultraDuckQuacker.checkStop()) {
            console.log('🦆 Ignoring check, page stopped 🦆');
            return false;
        }
        // do check stuff;
        console.log('🦆 Running check 🦆');
        console.log('🦆 Count: ' + (ultraDuckQuacker.hiddenCount + ultraDuckQuacker.filteredCount) + " / " + ultraDuckQuacker.totalCount);
        if ((ultraDuckQuacker.hiddenCount + ultraDuckQuacker.filteredCount) === ultraDuckQuacker.totalCount) {
            return true;
        }
        console.log('🦆 Found one 🦆');
        ultraDuckQuacker.quack();
    }

    static flashTitle() {
        if (document.title === ultraDuckQuacker.originalTitle){
            document.title = '* New Items *';
        } else {
            document.title = ultraDuckQuacker.originalTitle;
        }
    }

    static stopFlashTitle() {
        clearInterval(ultraDuckQuacker.titleInterval);
        document.title = ultraDuckQuacker.originalTitle;
        window.removeEventListener("focus", ultraDuckQuacker.stopFlashTitle);
    }

    static showNotif() {
        if (! ultraDuckQuacker.showNotifications)
            return false;

        var page;
        switch (queue) {
            case "potluck":
                page = 'RFY';
                if (! ultraDuckQuacker.showNotificationsOnRFY)
                    return false;
                break;
            case "last_chance":
                page = 'AFA';
                if (! ultraDuckQuacker.showNotificationsOnAFA)
                    return false;
                break;
            case "encore":
                page = 'AI';
                if (! ultraDuckQuacker.showNotificationsOnAI)
                    return false;
                break;
        }

        GM_notification({
            text: "🦆🦆 quack quack 🦆🦆",
            title: "New item listed on " + page,
            image: ultraDuckQuacker.quackImage,
            onclick: function() {
                window.parent.focus();
            }
        });
    }
}
