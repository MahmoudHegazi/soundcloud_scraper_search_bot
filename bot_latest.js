const bot = {
    limit: 0,
    stop: false,
    timeout: null,
    currentScoll: 0,
    data: [],
    urls: [],
    randomWait: function(maxSeconds = 12, minSeconds = 4) {
        // in programing last num not included so add +1 to wait with option max time user said
        maxSeconds += 1;
        const rand = Math.floor(Math.random() * (maxSeconds - minSeconds)) + minSeconds;
        return (rand * 1000);
    },

    start: function(timeWait = 1000, scrollSize = 500, randomMax = 12, randomMin = 4) {
        if (bot.stop) {
            return false;
        }
        if (timeWait == 'random' || isNaN(parseInt(timeWait))) {
            timeWait = bot.randomWait(randomMax, randomMin);
        }

        let stop1 = ((window.innerHeight + window.scrollY) + 50) >= document.body.offsetHeight;
        let stop2 = (bot.currentScoll >= document.body.offsetHeight);
        const cbResult = bot.getPageSongs();
        if (Array.isArray(cbResult) && cbResult.length > 0) {
            bot.data.push(...cbResult);
        } else {
            console.log("one of cb results is empty");
        }

        if (stop1 || stop2) {
            console.log("completed");
            return false;
        }

        window.scrollTo({
            left: 0,
            top: bot.currentScoll,
            behavior: 'smooth'
        });
        bot.currentScoll += scrollSize;

        if (bot.timeout) {
            clearTimeout(bot.timeout);
        }
        bot.timeout = setTimeout(() => {
            bot.start(timeWait, scrollSize, randomMax, randomMin);
        }, timeWait);
    },
    getUrlFromBGU: function(backgroundImage) {
        let urlParts = backgroundImage.split("(");
        let targetUrl = '';
        if (urlParts.length >= 2) {
            targetUrl = urlParts[1];
        }
        if (targetUrl) {
            targetUrl = targetUrl.replace(")", "");
        }
        if (targetUrl) {
            const whichQuote = targetUrl.startsWith("'") ? "'" : targetUrl.startsWith('"') ? '"' : '';
            if (whichQuote) {
                targetUrl = targetUrl.replaceAll(whichQuote, "");
            }
        }
        return targetUrl;
    },
    getObjIndexByUrl: function(url = '') {
        let index = -1;
        for (let i = 0; i < bot.data.length; i++) {
            if (bot.data[i].url === url) {
                index = i;
                break;
            }
        }
        return index;
    },
    getPageSongs: function() {
        const songs = [];
        // that consider scraper with performance or bot tester run on server
        const songElms = Array.from(document.querySelectorAll(".lazyLoadingList__list.sc-list-nostyle.sc-clearfix li.searchList__item"));

        const pageOrigin = window.location.origin;
        if (!pageOrigin) {
            console.error("origin of page can not recived, bot is facing un normal action, need code check");
            return songs;
        }



        for (let i = 0; i < songElms.length; i++) {
            const songElm = songElms[i];
            const song = {
                title: '',
                image: '',
                url: '',
                username: '',
                userUrl: ''
            };
            let uniqueSong = true;
            const urlElm = songElm.querySelector("div.sound__content a.soundTitle__title");
            if (urlElm) {

                const songUrl = urlElm.getAttribute("href");
                if (songUrl && !bot.urls.includes(songUrl)) {
                    const titleElm = urlElm.querySelector("span");
                    if (titleElm && titleElm.innerText) {
                        song['title'] = titleElm.innerText;
                    }
                    song['url'] = songUrl.trim();
                    bot.urls.push(songUrl);
                } else {
                    // recap on old images
                    const oldObjI = bot.getObjIndexByUrl(songUrl);
                    const oldObj = (oldObjI != -1) ? bot.data[oldObjI] : null;
                    if (oldObj && !oldObj.image){
                       bot.data.splice(oldObjI, 1);
                    } else {
                       uniqueSong = false;
                    }
                    
                }
            }
            if (!uniqueSong) {
                continue;
            }
            const userElm = songElm.querySelector("div.sound__content a.soundTitle__username");
            if (userElm && userElm.href) {
                song['userUrl'] = userElm.href;
                const userName = userElm.querySelector("span.soundTitle__usernameText");
                if (userName && userName.innerText) {
                    song['username'] = userName.innerText;
                }
            }
            const imgElm = songElm.querySelector("div.sound__artwork div.image.sc-artwork span[aria-role='img']");
            if (imgElm && imgElm.style.backgroundImage) {
                const imageUrl = bot.getUrlFromBGU(imgElm.style.backgroundImage);
                if (imageUrl) {
                    song['image'] = imageUrl.trim();
                } else {
                    console.log("here", imageUrl, "\n", imgElm.style.backgroundImage);
                }
            }
            if (song.url) {
                songs.push(song);
            }

        }
        return songs;
    }
}



console.log("bot will start after 10 seconds");
setTimeout(() => {
    bot.start('random', 800, 4, 1);
}, 2000);
