import Client from './client';
import { getRenderer } from './getIPCRenderer';

const client = new Client(getRenderer);

export {
    client
};