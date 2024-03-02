
let started = false;
chrome.storage.local.set({ 'isStarted': started });
var myInterval;

chrome.runtime.onMessage.addListener(function (msg) {
  if (msg.type === 'stop') {
    // clear interval code below.
    chrome.action.setIcon({ path: 'icon128.png' });
    started = false;
    chrome.storage.local.set({ 'isStarted': started });
    clearInterval(myInterval);
  }
  if (typeof msg.start !== 'undefined') {
    if (!started) {
      started = true;
      chrome.storage.local.set({ 'isStarted': started });

      myInterval = setInterval(() => {
        var today = new Date();
        var yy = today.getFullYear();
        var mm = today.getMonth();
        var dd = today.getDate();

        var start_time = new Date(yy, mm, dd, msg.start[0], msg.start[1]);
        var end_time = new Date(yy, mm, dd, msg.end[0], msg.end[1]);

        var total_sec = (end_time - start_time) / 1000.;
        var diff_sec = (today - start_time) / 1000.;

        var percent = diff_sec / total_sec * 100.;
        percent = parseInt(percent);

        canvas = new OffscreenCanvas(256, 256);
        canvas.width = 19;
        canvas.height = 19;

        var context = canvas.getContext('2d');
        context.fillStyle = "rgba(0, 0, 0, 0)";
        context.fillRect(0, 0, 19, 19);

        context.fillStyle = "#000000";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "18px Serif";
        context.fillText(String(percent), 9, 12);
        chrome.action.setIcon({ imageData: context.getImageData(0, 0, 19, 19) });

      }, 1000);
    } 
  }
});
