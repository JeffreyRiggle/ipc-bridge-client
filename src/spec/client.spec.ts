import Client from '../client.ts';
import IPCMock from './ipcMock.ts';
import { expect } from 'chai';

describe('ipc client', function() {
    
    let client: Client;
    describe('when ipc is not available', function() {
        beforeEach(() => {
            client = new Client(() => undefined);
        });

        it('should not be available', () => {
            expect(client.available).to.be.equal(false);
        });

        describe('when send message is used', () => {
            let thrown = false;

            beforeEach((done) => {
                client.sendMessage('test', {'data': 1}).catch(() => {
                    thrown = true;
                }).finally(() => {
                    done();
                });
            })
            
            it('should throw', () => {
                expect(thrown).to.be.equal(true);
            });
        });
    });
    describe('when ipc is available', () => {
        let ipcMock: IPCMock;
        beforeEach(() => {
            ipcMock = new IPCMock();

            client = new Client(() => ipcMock);
        });

        it('should be available', () => {
            expect(client.available).to.be.equal(true);
        });

        describe('when send message is used', () => {

            beforeEach((done) => {
                client.sendMessage('test', {'data': 1}).finally(() => {
                    done();
                });
            })
            
            it('should send the message', () => {
                expect(ipcMock.sentMessages.length).to.be.equal(1);
            });

            it('should not leave any events', () => {
                let eventsLeft = false;
                ipcMock.invocationMap.forEach((value, key) => {
                    eventsLeft = eventsLeft || key.startsWith('cid');
                });

                expect(eventsLeft).to.be.equal(false);
            })
        });
    })
});