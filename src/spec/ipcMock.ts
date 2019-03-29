class IPCMock {
    public invocationMap : Map<string, Function>;
    public sentMessages : Array<any>;

    constructor() {
        this.invocationMap = new Map();
        this.sentMessages = [];
    }

    on(event : string, callback : Function) : void {
        this.invocationMap.set(event, callback);
    }

    off(event : string, callback : Function) : void {
        this.invocationMap.delete(event);
    }

    send(event : string, data : any) : void {
        if (event === 'healthcheck') {
            let cb = this.invocationMap.get('heartbeat');
            if (cb) {
                cb();
            }
        } else {
            this.sentMessages.push({event: event, data: data});
            let cb = this.invocationMap.get(`cid${data.correlationId}`);
            if (cb) {
                cb();
            }
        }
    }
}

export default IPCMock;