///<reference path="../node_modules/@types/node/ts3.2/index.d.ts" />
import { EventEmitter } from 'events';

class Client extends EventEmitter {
    private _cid : number;
    private _available : boolean;
    private _subscriptions : Map<String, Function[]>;
    private _ipcRenderer : any;

    constructor(getRenderer : Function) {
        super();
        this._cid = 1;
        this._available = false;
        this._subscriptions = new Map();
        this._ipcRenderer = getRenderer();

        this.setupIPC();
    }

    private setupIPC() : void {
        if (this._ipcRenderer) {
            this.setupIPCBridge(() => {
                super.emit(this.availableChanged, true);
            });
        }
    }

    private setupIPCBridge(callback : Function) : void {
        this._ipcRenderer.on('heartbeat', () => {
            this._available = true;
            callback();
        });
    
        this._ipcRenderer.send('healthcheck');
    }

    private handleEvent(event : string) {
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

    get availableChanged() : string {
        return 'availableChanged';
    }

    get available() : boolean {
        return this._available;
    }

    sendMessage(event : string, message : any) : Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.available) {
                reject('IPC Service not available');
                return;
            }
    
            let corid = this._cid++;
            const cbevent = `cid${corid}`;
            this._ipcRenderer.on(cbevent, function _resolutionListener(event : string, data : any) {
                this._ipcRenderer.removeListener(cbevent, _resolutionListener);
                resolve(data);
            });
    
            this._ipcRenderer.send('request', {
                id: event, 
                data: message,
                correlationId: corid
            });
        });
    }

    subscribeEvent(event : string, callback : Function) : void {
        if (!this.available) {
            return;
        }

        let sub = this._subscriptions.get(event);

        if (!sub) {
            this._ipcRenderer.on(event, this.handleEvent(event).bind(this));
            this._subscriptions.set(event, [callback]);
        }
        else {
            sub.push(callback);
        }

        this._ipcRenderer.send('subscribe', event);
    }

    unsubcribeEvent(event : string, callback : Function) : void {
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