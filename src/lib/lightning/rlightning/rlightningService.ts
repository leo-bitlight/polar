import { LightningNode, OpenChannelOptions } from 'shared/types';
import { LightningService } from 'types';
import {
  LightningNodeInfo,
  LightningNodeBalances,
  LightningNodeAddress,
  LightningNodeChannel,
  LightningNodePeer,
  LightningNodeChannelPoint,
  // CustomRecords,
  LightningNodePayReceipt,
  LightningNodePaymentRequest,
  LightningNodeChannelEvent,
} from '../types';
import { httpPost } from './api';
import {
  BalancesResponse,
  Bolt11ReceiveRequest,
  Bolt11ReceiveResponse,
  Bolt11SendRequest,
  OpenChannelRequest,
  OpenChannelResponse,
  PeerDetails,
  SendResponse,
  WalletNewAddressResponse,
} from 'lib/rgb/IService';

export default class RLightningService implements LightningService {
  async waitUntilOnline(node: LightningNode): Promise<void> {
    node;
    throw new Error('Method not implemented.');
  }

  async getInfo(node: LightningNode): Promise<LightningNodeInfo> {
    node;
    throw new Error('Method not implemented.');
  }

  async getBalances(node: LightningNode): Promise<LightningNodeBalances> {
    const res = await httpPost<BalancesResponse>(node, 'balances');

    return {
      total: String(res.total_onchain_balance_sats),
      confirmed: String(res.total_lightning_balance_sats),
      unconfirmed: '0',
    };
  }

  async getNewAddress(node: LightningNode): Promise<LightningNodeAddress> {
    const res = await httpPost<WalletNewAddressResponse>(node, 'new_address');
    const address = res.address;
    if (!address) {
      throw new Error(`Failed to create new address: ${JSON.stringify(res)}`);
    }
    return { address };
  }

  async getChannels(node: LightningNode): Promise<LightningNodeChannel[]> {
    node;
    throw new Error('Method not implemented.');
  }

  async getPeers(node: LightningNode): Promise<LightningNodePeer[]> {
    const res = await httpPost<PeerDetails[]>(node, 'listpeers');
    return res
      .filter(p => p.is_connected)
      .map(p => ({
        pubkey: p.node_id,
        address: p.address,
      }));
  }

  async connectPeers(node: LightningNode, rpcUrls: string[]): Promise<void> {
    node;
    rpcUrls;
    // const peers = await this.getPeers(node);
    // const keys = peers.map(p => p.pubkey);
    // const newUrls = rpcUrls.filter(u => !keys.includes(u.split('@')[0]));

    // for (const toRpcUrl of newUrls) {
    //   try {
    //     const body = { id: toRpcUrl };
    //     await httpPost<{ id: string }>(node, 'connect', body);
    //   } catch (error: any) {}
    // }
  }

  async openChannel({
    from,
    toRpcUrl,
    amount,
    isPrivate,
  }: OpenChannelOptions): Promise<LightningNodeChannelPoint> {
    // add peer if not connected already
    await this.connectPeers(from, [toRpcUrl]);
    // get pubkey of dest node
    const [toPubKey] = toRpcUrl.split('@');

    // open the channel
    const body: OpenChannelRequest = {
      node_id: toPubKey,
      // address 什么意思，是不是和 node_id 有一个就行
      address: '',
      channel_amount_sats: amount,
      push_to_counterparty_msat: 0,
      announce: isPrivate ? false : true,
    };
    const res = await httpPost<OpenChannelResponse>(from, 'open', body);
    console.info('Opened channel response:', res);

    // 打开通道缺少 fund 交易信息
    return {
      txid: '',
      index: 0,
    };
  }

  async closeChannel(node: LightningNode, channelPoint: string): Promise<any> {
    // throw new Error('Method not implemented.');
    console.info('closeChannel called with:', { node, channelPoint });

    // const body = { user_channel_id: channelPoint, counterparty_node_id: 1 };
    // await httpPost<CLN.CloseChannelResponse>(node, `close`, body);
    // return true;
  }

  async createInvoice(
    node: LightningNode,
    amount: number,
    memo?: string,
    // assetInfo?: { nodeId: string; scid: string; msats: string },
  ): Promise<string> {
    const body: Bolt11ReceiveRequest = {
      amount_msat: amount * 1000,
      description: memo || `Payment to ${node.name}`,
      expiry_secs: 3600, // 1 hour
    };
    const inv = await httpPost<Bolt11ReceiveResponse>(node, 'receive', body);

    return inv.invoice;
  }

  async payInvoice(
    node: LightningNode,
    invoice: string,
    // amount?: number,
    // customRecords?: CustomRecords,
  ): Promise<LightningNodePayReceipt> {
    const body: Bolt11SendRequest = {
      invoice: invoice,
    };

    const res = await httpPost<SendResponse>(node, 'pay', body);
    console.info('Payment response:', res);

    // 返回值不兼容
    return {
      preimage: '',
      amount: 0,
      destination: '',
    };
  }

  async decodeInvoice(
    node: LightningNode,
    invoice: string,
  ): Promise<LightningNodePaymentRequest> {
    node;
    invoice;
    throw new Error('Method not implemented.');
  }

  async addListenerToNode(node: LightningNode): Promise<void> {
    node;
    throw new Error('Method not implemented.');
  }

  async removeListener(node: LightningNode): Promise<void> {
    node;
    throw new Error('Method not implemented.');
  }
  async subscribeChannelEvents(
    node: LightningNode,
    callback: (event: LightningNodeChannelEvent) => void,
  ): Promise<void> {
    node;
    callback;
    throw new Error('Method not implemented.');
  }
}
