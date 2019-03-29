import Client from './client.ts';
import { getRenderer } from './getIPCRenderer.ts';

const client = new Client(getRenderer);

export {
    client
};