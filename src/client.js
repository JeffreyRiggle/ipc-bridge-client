import {EventEmitter} from 'events';
import getIPCRenderer from './getIPCRenderer';

class Client extends EventEmitter {
    constructor() {
        super();
        this._cid = 1;
        this._available = false;
        this._subscriptions = new Map();

        this.setupIPC();
    }

    setupIPC() {
        this._ipcRenderer = getIPCRenderer();

        if (this._ipcRenderer) {
            this.setupIPCBridge(() => {
                this.emit(this.availableChanged, true);
            });
        }
    }

    setupIPCBridge(callback) {
        this._ipcRenderer.on('heartbeat', () => {
            this._available = true;
            callback();
        });
    
        this._ipcRenderer.send('healthcheck');
    }

    _handleEvent(event) {
        return (sender, message) => {
            let subs = this._subscriptions.get(event);
    
            if (!subs) {
                return;
            }
    
            subs.forEach(subscription => {
                subscription(message);
            });
        }
    }

    get availableChanged() {
        return 'availableChanged';
    }

    get available() {
        return this._available;
    }

    sendMessage(event, message) {
        return new Promise((resolve, reject) => {
            if (!this.available) {
                reject('IPC Service not available');
                return;
            }
    
            let corid = this._cid++;
            const cbevent = `cid${corid}`;
            this._ipcRenderer.on(cbevent, (event, data) => {
                this._ipcRenderer.off(cbevent);
                resolve(data);
            });
    
            this._ipcRenderer.send('request', {
                id: event, 
                data: message,
                correlationId: corid
            });
        });
    }

    subscribeEvent(event, callback) {
        if (!this.available) {
            return;
        }

        let sub = this._subscriptions.get(event);

        if (!sub) {
            this._ipcRenderer.on(event, this._handleEvent(event).bind(this));
            this._subscriptions.set(event, [callback]);
        }
        else {
            sub.push(callback);
        }

        this._ipcRenderer.send('subscribe', event);
    }

    unsubcribeEvent(event, callback) {
        if (!this.available) {
            return;
        }

        let sub = this._subscriptions.get(event);

        if (!sub) {
            return;
        }

        let ind = sub.indexOf(callback);

        if (ind !== -1) {
            sub.splice(ind, 1);
        }

        if (sub.length !== 0) {
            return;
        }

        this._subscriptions.delete(event);
        this._ipcRenderer.removeListener(event, callback);
        this._ipcRenderer.send('unsubscribe', event);
    }
}

export default Client;