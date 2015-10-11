var { ToggleButton } = require('sdk/ui/button/toggle');
var self = require('sdk/self');
var panels = require("sdk/panel");

var button = ToggleButton({
    id: "reviewboard-icon",
    label: "Review Board Screenshot Tool",
    icon: {
        "16": "./images/icons/icon16.png",
        "32": "./images/icons/icon32.png",
        "64": "./images/icons/icon64.png"
    },
    onChange: handleChange
});

var panel = panels.Panel({
    height: 210,
    width: 200,
    contentURL: self.data.url("popup.html"),
    contentScriptFile: self.data.url("js/popup.js"),
    onHide: handleHide
});

function handleChange(state) {
    if(state.checked) {
        panel.show({
            position: button
        });
    }
}

function handleHide() {
    button.state('window', {checked: false});
}