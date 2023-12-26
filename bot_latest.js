let stop = false;
let timeout = null;
let currentScoll = 0;
const data = [];

function scroller(cb = () => {}, timeWait = 1000, scrollSize = 500, randomMax = 12, randomMin = 4) {
    if (stop) {
        return false;
    }
    if (timeWait == 'random' || isNaN(parseInt(timeWait))) {
        timeWait = randomWait(randomMax, randomMin);
    }

    let stop1 = ((window.innerHeight + window.scrollY) + 50) >= document.body.offsetHeight;
    let stop2 = (currentScoll >= document.body.offsetHeight);
    const cbResult = cb();
    if (Array.isArray(cbResult) && cbResult.length > 0) {
        data.push(...cbResult);
    } else {
        console.log("one of cb results is empty");
    }

    if (stop1 || stop2) {
        console.log("completed");
        return false;
    }

    window.scrollTo(0, currentScoll);
    currentScoll += scrollSize;

    if (timeout) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
        scroller(cb, timeWait);
    }, timeWait);
}

function randomWait(maxSeconds = 12, minSeconds = 4) {
    // in programing last num not included so add +1 to wait with option max time user said
    maxSeconds += 1;
    const rand = Math.floor(Math.random() * (maxSeconds - minSeconds)) + minSeconds;
    return (rand * 1000);
}

function getPageSongs() {
    const songs = [];
    const urls = [];
    // that consider scraper with performance or bot tester run on server
    const songElms = document.querySelectorAll(".lazyLoadingList__list.sc-list-nostyle.sc-clearfix li.searchList__item");

    const pageOrigin = window.location.origin;
    if (!pageOrigin) {
        console.error("origin of page can not recived, bot is facing un normal action, need code check");
        return songs;
    }

    function getUrlFromBGU(backgroundImage) {
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
            if (songUrl && !urls.includes(songUrl)) {
                const titleElm = urlElm.querySelector("span");
                if (titleElm && titleElm.innerText) {
                    song['title'] = titleElm.innerText;
                }
                song['url'] = pageOrigin + songUrl.trim();
                urls.push(songUrl);
            } else {
                uniqueSong = false;
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
            const imageUrl = getUrlFromBGU(imgElm.style.backgroundImage);
            if (imageUrl) {
                song['image'] = pageOrigin + imageUrl.trim();
            } else {
                console.log("here", imageUrl, "\n", imgElm.style.backgroundImage);
            }
        }
        songs.push(song);
    }
    return songs;
}
scroller(getPageSongs, 'random', 500, 12, 4);