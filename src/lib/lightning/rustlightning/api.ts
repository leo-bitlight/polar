// import { createIpcSender } from 'lib/ipc/ipcService';
import { RustLightningNode, LightningNode } from 'shared/types';
import { io, type Socket } from 'socket.io-client';
// import { read } from 'utils/files';

interface ConfigOptions {
  url: string;
  headers: {
    // rune: string;
  };
}

const setupConfig = (rln: RustLightningNode): ConfigOptions => {
  rln;
  const config = {
    // url: `http://127.0.0.1:${rln.ports.rest}/v1`,
    url: 'https://nodes.lightning.computer/fees/v1/btc-fee-estimates.json?',
    headers: {
      // rune,
    },
  };
  return config;
};

const request = async <T>(
  node: LightningNode,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  data?: any,
): Promise<T> => {
  if (node.implementation !== 'rustlightning') {
    throw new Error(
      `RustLightningService cannot be used for '${node.implementation}' nodes`,
    );
  }

  const rln = node as RustLightningNode;
  // const id = Math.round(Math.random() * Date.now());

  const config = setupConfig(rln);
  const url = `${config.url}/${path}`;
  const body = data ? JSON.stringify(data) : undefined;

  const response = await fetch(url, {
    method,
    headers: {
      ...config.headers,
      'Content-Type': 'application/json',
    },
    body,
  });

  const json = await response.json();
  // debug(`r-lightning API: [response] ${rln.name} ${id} ${JSON.stringify(json, null, 2)}`);

  if (json.code && json.message) {
    const { code, message } = json;
    throw new Error(`lightningd ${code}: ${message}`);
  }

  // return snakeKeysToCamel(json) as T;
  return json as T;
};

// const request2 = async <T>(
//   node: LightningNode,
//   method: string,
//   path: string,
//   body?: any,
// ): Promise<T> => {
//   if (node.implementation !== 'rustlightning') {
//     throw new Error(`RustlightningService request2 error`);
//   }

//   const config = setupConfig(node as RustLightningNode);
//   const args = {
//     url: `${config.url}/${path}`,
//     method,
//     body,
//     headers: {
//       ...config.headers,
//       'Content-Type': 'application/json',
//     },
//   };
//   const ipc = createIpcSender('RustLightningApi', 'app');
//   const res = await ipc<any>('http', args);

//   if (res.error) throw new Error(res.error);

//   return res as T;
// };

export const httpPost = async <T>(
  node: LightningNode,
  path: string,
  body?: any,
): Promise<T> => {
  return request<T>(node, 'POST', path, body);
};

export const httpGet = async <T>(
  node: LightningNode,
  path: string,
  params?: any,
): Promise<T> => {
  return request<T>(node, 'GET', path, params);
};

const listenerCache: {
  [key: number]: Socket;
} = {};

export const getListener = async (node: RustLightningNode): Promise<Socket> => {
  if (!listenerCache[node.ports.rest]) {
    listenerCache[node.ports.rest] = await setupListener(node);
  }
  return listenerCache[node.ports.rest];
};

export const removeListener = (node: RustLightningNode): void => {
  if (listenerCache[node.ports.rest]) {
    listenerCache[node.ports.rest].disconnect();
    delete listenerCache[node.ports.rest];
  }
};

export const clearListeners = () => {
  Object.keys(listenerCache).forEach(key => {
    const port = parseInt(key);
    listenerCache[port].disconnect();
    delete listenerCache[port];
  });
};

export const setupListener = async (node: RustLightningNode): Promise<Socket> => {
  const config = setupConfig(node);
  listenerCache[node.ports.rest] = listen(config);
  return listenerCache[node.ports.rest];
};

const listen = (options: ConfigOptions): Socket => {
  const { url, headers } = options;
  const socket = io(url, { extraHeaders: headers, reconnectionAttempts: 1 });
  return socket;
};
