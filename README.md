# soundcloud_scraper_search_bot

This bot is for resume and portfolio (test bot first and then scraping bot) If you are a programmer, you should not use any of the attached scripts for the scraping process.

# stable version right now
scraper_function.js (manual scroll) get all data
bot.js (not load all images)

!note url is prop of global bot object so it getting only unique songs from search result, if you need return exact same soundcloud returns in search page bot runs on it (repeat songs), just move urls from bot and add it within getPageSongs

```javascript

    getPageSongs: function() {
        const songs = [];
        const urls = [];
    //......
```

and update the includes check in getPageSongs, instead of bot.urls make it urls only the local variable
```javascript
if (songUrl && !bot.urls.includes(songUrl)) {
// ......
```
to
```javascript
if (songUrl && !urls.includes(songUrl)) {
// ......
```

### notes:
bot tries to be not static and use random wait and also to make it work better and get all data wait large time u can control wait with params of bot.start, and also change random to static wait time or no wait
also you have options for random int min and max in seconds example at least get 4 seconds and max is 12 seconds get random from start, between, end, so it can function called by kids learned seconds just yet,
also bot desgined in way more aggrisve so it will get the data by meaning `get what can get fast`, if they stopped bot using anyway the property bot.data will let you get last data stoped at or when unexcpted action occured in other words this always returns data as unusal action start late, also you can save data direct in localstorage instead of bot.data and also if u keep app like that save the urls list as well in localstorage so not repeat songs

![image](https://github.com/MahmoudHegazi/soundcloud_scraper_search_bot/assets/55125302/71aac1d2-7db8-4835-a2e9-ccc75a0301e7)


### info 
if need make it more accurate and get all data just scroll manual or with mouse auto scroll to end of page by leaving pc a while and one call to function getPageData from file scraper_function.js all you will get all data as image take time to load
