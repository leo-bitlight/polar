export enum Status {
  Starting,
  Started,
  Stopping,
  Stopped,
  Error,
}

export interface CommonNode {
  id: number;
  /** 该节点所属的网络 */
  networkId: number;
  /** 该节点的名字 alice bob 等 */
  name: string;
  /** 该节点的网络类型 */
  type: 'bitcoin' | 'lightning' | 'tap';
  /** 该节点使用的版本 */
  version: string;
  status: Status;
  errorMsg?: string;
  docker: {
    /** 默认是空 只有自定义节点有值 */
    image: string;
    /** 默认为空 只有自定义节点有值。为空时会使用 constant 文件中定义的启动命令 */
    command: string;
  };
}

export interface LightningNode extends CommonNode {
  type: 'lightning';
  implementation: 'LND' | 'c-lightning' | 'eclair' | 'litd' | 'rustlightning';
  /** 该节点使用的 比特币节点 的名字，比如同一个比特币节点启了多个实例，名字分别为 backend1 backend2 等 */
  backendName: string;
  ports: Record<string, number | undefined>;
}

export interface LndNode extends LightningNode {
  implementation: 'LND';
  paths: {
    tlsCert: string;
    adminMacaroon: string;
    invoiceMacaroon: string;
    readonlyMacaroon: string;
  };
  ports: {
    rest: number;
    grpc: number;
    p2p: number;
  };
}

export interface CLightningNode extends LightningNode {
  implementation: 'c-lightning';
  paths: {
    rune: string;
    tlsCert?: string;
    tlsClientCert?: string;
    tlsClientKey?: string;
  };
  ports: {
    rest: number;
    grpc: number;
    p2p: number;
  };
}

export interface RustLightningNode extends LightningNode {
  implementation: 'rustlightning';
  paths: {
    rune: string;
    tlsCert?: string;
    tlsClientCert?: string;
    tlsClientKey?: string;
  };
  ports: {
    rest: number;
    grpc: number;
    p2p: number;
  };
}

export interface EclairNode extends LightningNode {
  implementation: 'eclair';
  ports: {
    rest: number;
    p2p: number;
  };
}

export interface BitcoinNode extends CommonNode {
  type: 'bitcoin';
  implementation: 'bitcoind' | 'btcd';
  peers: string[];
  ports: Record<string, number>;
}

export interface BitcoindNode extends BitcoinNode {
  implementation: 'bitcoind';
  ports: {
    rpc: number;
    p2p: number;
    zmqBlock: number;
    zmqTx: number;
  };
}

export interface TapNode extends CommonNode {
  type: 'tap';
  implementation: 'tapd' | 'litd';
  ports: Record<string, number | undefined>;
}

export interface TapdNode extends TapNode {
  lndName: string;
  paths: {
    tlsCert: string;
    adminMacaroon: string;
  };
  ports: {
    rest: number;
    grpc: number;
  };
}

export interface LitdNode extends LightningNode {
  implementation: 'litd';
  // lndName is the name of the lnd node that the lit node is connected to. For litd,
  // this will always be the same as the litd node name, since it runs tapd integrated.
  // We keep it also under this field for consistency with TapdNode. It greatly simplifies
  // the code used to get the lnd node name that the lit node is connected to.
  lndName: string;
  paths: {
    // lnd paths
    tlsCert: string;
    adminMacaroon: string;
    invoiceMacaroon: string;
    readonlyMacaroon: string;
    // lit paths
    litTlsCert: string;
    litMacaroon: string;
    // tap paths
    tapMacaroon: string;
  };
  ports: {
    rest: number;
    grpc: number;
    p2p: number;
    web: number;
  };
}

export type NodeImplementation =
  | BitcoinNode['implementation']
  | LightningNode['implementation']
  | TapNode['implementation'];

export type NodeImplementationWithSimln = NodeImplementation | 'simln';

export type AnyNode = BitcoinNode | LightningNode | TapNode;

export type TapSupportedNode = TapdNode | LitdNode;

export interface OpenChannelOptions {
  from: LightningNode;
  toRpcUrl: string;
  amount: string;
  isPrivate: boolean;
}
