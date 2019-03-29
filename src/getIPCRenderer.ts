
declare global {
    interface Window { require: any }
}

const getRenderer = () : any => {
    let retVal;
    if (window.require) {
        const electron = window.require('electron');
        retVal = electron.ipcRenderer;
    }

    return retVal;
}

export {
    getRenderer
}