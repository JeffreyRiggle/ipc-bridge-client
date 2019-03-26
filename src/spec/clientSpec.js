import ClientInjector from 'inject-loader!../client';

class IPCMock {
    constructor() {
        this.invocationMap = new Map();
        this.sentMessages = [];
    }

    on(event, callback) {
        this.invocationMap.set(event, callback);
    }

    off(event, callback) {
        this.invocationMap.delete(event);
    }

    send(event, data) {
        this.sentMessages.push({event: event, data: data});

        if (event === 'healthcheck') {
            let cb = this.invocationMap.get('heartbeat');
            if (cb) {
                cb();
            }
        } else {
            let cb = this.invocationMap.get(event);
            if (cb) {
                cb();
            }
        }
    }
}

describe('ipc client', function() {
    let client;
    describe('when ipc is not available', function() {
        beforeEach(() => {
            client = new ClientInjector({
                './getIPCRenderer': function() {
                    return undefined;
                }
            });
        });

        it('should not be available', () => {
            expect(client.available).toBe(false);
        });

        describe('when send message is used', () => {
            let thrown = false;

            beforeEach((done) => {
                client.sendMessage('test', {'data': 1}).catch(() => {
                    thrown = true
                }).finally(() => {
                    done();
                });
            })
            
            it('should throw', () => {
                expect(thrown).toBe(true);
            });
        });
    });
    describe('when ipc is available', () => {
        let ipcMock;
        beforeEach(() => {
            ipcMock = new IPCMock();

            client = new ClientInjector({
                './getIPCRenderer': function() {
                    return ipcMock;
                }
            });
        });

        it('should be available', () => {
            expect(client.available).toBe(true);
        });

        describe('when send message is used', () => {

            beforeEach((done) => {
                client.sendMessage('test', {'data': 1}).finally(() => {
                    done();
                });
            })
            
            it('should send the message', () => {
                expect(ipcMock.sentMessages.length).toBe(1);
            });
        });
    })
});