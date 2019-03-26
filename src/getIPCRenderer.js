export default function() {
    let retVal;
    if (window.require) {
        const electron = window.require('electron');
        retVal = electron.ipcRenderer;
    }

    return retVal;
}