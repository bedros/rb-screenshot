self.port.on('dataUrl', function(url) {
    var message = {'option': 'setScreenshotUrl',
                   'url': url};
    sendMessageToPageScript(message);
});

self.port.on('setCrop', function() {
    var message = {'option': 'setCrop'}
    sendMessageToPageScript(message);
});

setServers();
setListeners();

/**
 * Sets listeners for elements that require saved userData from the browser.
 */
function setListeners() {
    var serverDropdown = document.getElementById('account-select');
    serverDropdown.addEventListener('change', function() {
        setInformation();
    });

    var form = document.getElementById('user-form');
    form.addEventListener('update', function() {
        setInformation();
    });

    var send = document.getElementById('send-button');
    send.addEventListener('click', function() {
        self.port.emit('get-users');
        self.port.on('users', sendScreenshot);
    });
}

/**
 * Sends the screenshot to a Review Board server.
 *
 * @param userInfo (Array) - Array of user information stored in browser.
 */
function sendScreenshot(userInfo) {
    if(userInfo) {
        var serverSelect = document.getElementById('account-select');
        var screenshot = document.screenshot;

        var reviewRequest = document.getElementById('rr-select').value;
        var screenshotUri = document.getElementById('screenshot').src;
        var index = serverSelect.options[serverSelect.selectedIndex].value;

        var serverUrl = userInfo[index].serverUrl;
        var username = userInfo[index].username;
        var apiKey = userInfo[index].apiKey;

        var message = {'option': 'sendScreenshot',
                       'serverUrl': serverUrl,
                       'username': username,
                       'apiKey': apiKey,
                       'reviewRequest':  reviewRequest,
                       'screenshotUri': screenshotUri}
        sendMessageToPageScript(message);
    }
    self.port.removeListener('users', sendScreenshot);
}

/**
 * Emits a message to the `index.js` script requesting for user
 * data and lets sendInformation handle the data.
 */
function setInformation() {
    self.port.emit('get-users');
    self.port.on('users', sendInformation);
}

/**
 * Resets the table cell ids to correspond to the proper row that the
 * cell is in. Note: the last character in a cell id, corresponds to
 * the position of that data in the stored userInfo array.
 */
function sendInformation(userInfo) {
    var serverSelect = document.getElementById('account-select');
    var index =  serverSelect.options[serverSelect.selectedIndex].value;
    var message = {'option': 'setUsername',
                   'username': userInfo[index].username};
    sendMessageToPageScript(message);
    message = {'option': 'setReviewRequests',
               'serverUrl': userInfo[index].serverUrl,
               'username': userInfo[index].username}
    sendMessageToPageScript(message)
    self.port.removeListener('users', sendInformation);
}

/**
 * Resets the table cell ids to correspond to the proper row that the
 * cell is in. Note: the last character in a cell id, corresponds to
 * the position of that data in the stored userInfo array.
 */
function setServers() {
    var serverDropdown = document.getElementById('account-select');
    self.port.emit('get-users');
    self.port.once('users', function(userInfo) {
        if (userInfo) {
            var message = {'option': 'setServers',
                           'users': userInfo}
            sendMessageToPageScript(message);
        }
    });
}

/**
 * Resets the table cell ids to correspond to the proper row that the
 * cell is in. Note: the last character in a cell id, corresponds to
 * the position of that data in the stored userInfo array.
 */
function sendMessageToPageScript(message) {
    var cloned = cloneInto(message, document.defaultView);
    var event = document.createEvent('CustomEvent');
    event.initCustomEvent('addon-message', true, true, cloned);
    document.documentElement.dispatchEvent(event);
}