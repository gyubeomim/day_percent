
// Default start and end times
const DEFAULT_START_TIME = '07:00';
const DEFAULT_END_TIME = '23:59';
var START_BTN = document.getElementById('start_btn');
var STOP_BTN = document.getElementById('stop_btn');

var START_INPUT = document.getElementById('start');
var END_INPUT = document.getElementById('end');

var NOTEPAD = document.getElementById('notepad');


chrome.storage.local.get('isStarted', function (result) {
	if (result.isStarted) {
		START_BTN.value = 'Started';
	}
	else {
		START_BTN.value = 'Start';
	}
});

// Update and save start and end times when changed
START_INPUT.addEventListener('change', () => {
  chrome.storage.local.set({ startTime: START_INPUT.value });
});

END_INPUT.addEventListener('change', () => {
  chrome.storage.local.set({ endTime: END_INPUT.value });
});


// Load saved start and end times from storage
chrome.storage.local.get(['startTime', 'endTime'], (result) => {
  if (result.startTime) {
    START_INPUT.value = result.startTime;
  } else {
    START_INPUT.value = DEFAULT_START_TIME;
  }

  if (result.endTime) {
    END_INPUT.value = result.endTime;
  } else {
    END_INPUT.value = DEFAULT_END_TIME;
  }
});

// Start Button.
START_BTN.onclick = function () {
	chrome.storage.local.get('isStarted', function (result) {
		var isStarted = result.isStarted;
		if (!isStarted) {
			START_BTN.value = 'Started';
			chrome.runtime.sendMessage({ start: START_INPUT.value.split(':'), end: END_INPUT.value.split(':') });
			chrome.storage.local.set({ 'isStarted': true });
		}
	});
};

// Stop Button.
STOP_BTN.onclick = function () {
	START_BTN.value = "Start";
	chrome.runtime.sendMessage({ type: 'stop' });
};


// notepad--------------------------------------------------------
document.getElementById('save').onclick = function () {
	// save notepad text
	chrome.storage.local.set({ 'Content': document.getElementById('notepad').value });
	chrome.storage.local.set({ 'Content_W': document.getElementById('notepad').offsetWidth });
	chrome.storage.local.set({ 'Content_H': document.getElementById('notepad').offsetHeight });
};


chrome.storage.local.get('Content', function (result) {
	if (result.Content) {
		NOTEPAD.value = result.Content;
	}
});

chrome.storage.local.get('Content_W', function (result) {
	if (result.Content_W) {
		NOTEPAD.style.width = result.Content_W + "px";
	}
});

chrome.storage.local.get('Content_H', function (result) {
	if (result.Content_H) {
		NOTEPAD.style.height = result.Content_H + "px";
	}
});
