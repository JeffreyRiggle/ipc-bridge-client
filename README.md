# ipc-bridge-client
This is a client library inteaded to be used as a wrapper around [Electron's](https://electronjs.org/) IPC Renderer. This is ment to be used in conjuction with [ipc-bridge-server](https://github.com/JeffreyRiggle/ipc-bridge-server) (main process).

## Installation
`$ npm install @jeffriggle/ipc-bridge-client`

## Usage

### Ensuring that the ipc renderer is available
One of the goals of this library is to allow for a page to optionally have the ipc renderer. In order to do this the ipc-bridge-client has an available property to let you know when/if the renderer process is available.

What this can cause in normal cases is a delay between page load and the ipc renderer being available for use. In order to account for this the ipc-bridge-client provides an event to let you know when the service has become available.

#### Checking availability
```javascript
let {client} = require('@jeffriggle/ipc-bridge-client');

if (client.available) {
    // Some logic here to interact with client
}
```

#### Waiting for availability
```javascript
let {client} = require('@jeffriggle/ipc-bridge-client');

if (client.available) {
    // Some logic here to interact with client
} else {
    client.on(client.availableChanged, (available) => {
        if (available) {
            // Some logic here to interact with client.
        }
    });
}
```

### Sending message to main process
```javascript
let {client} = require('@jeffriggle/ipc-bridge-client');

let data = 'any data you want to send';
client.sendMessage('customizablemessage', data).then(() => {
    // Logic for when request passes
}).catch((err) => {
    // Logic for when request failed
});
```

### Subscribing to messages from the main process
```javascript
let {client} = require('@jeffriggle/ipc-bridge-client');

client.subscribeEvent('customizablemessage', () => {
    // Logic for when message comes from main process
});
```

## Licence
ipc-bridge-client is released under [MIT](./LICENSE)