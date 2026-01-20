export type OkResponse = { ok: boolean };

export type VersionResponse = {
  api_version: string; // "v1"
  api_crate_version: string;
  core_crate_version: string;
};

export type StatusResponse = {
  is_running: boolean;
  is_listening: boolean;
  best_block_height: number; // u32
};

export type NodeIdResponse = { node_id: string };

export type ListeningAddressesResponse = { addresses: string[] };

export type WalletNewAddressResponse = { address: string };

export type BalancesResponse = {
  total_onchain_balance_sats: number; // u64
  spendable_onchain_balance_sats: number; // u64
  total_anchor_channels_reserve_sats: number; // u64
  total_lightning_balance_sats: number; // u64
};

export type PeerDetails = {
  node_id: string;
  address: string;
  is_persisted: boolean;
  is_connected: boolean;
};

export type OpenChannelRequest = {
  node_id: string; // secp256k1 pubkey hex
  address: string; // "ip:port" | "[ipv6]:port"
  channel_amount_sats: number | string; // u64
  push_to_counterparty_msat?: number | null; // u64
  announce?: boolean | null; // default true
};

export type OpenChannelResponse = {
  user_channel_id: string; // hex 16 bytes（32 chars）
};

export type CloseChannelRequest = {
  user_channel_id: string; // hex 16 bytes（32 chars）
  counterparty_node_id: string; // pubkey hex
};

export type Bolt11ReceiveRequest = {
  amount_msat: number; // u64
  description: string;
  expiry_secs: number; // u32
};

export type Bolt11ReceiveResponse = { invoice: string };

export type Bolt11ReceiveVarRequest = {
  description: string;
  expiry_secs: number; // u32
};

export type Bolt11SendRequest = { invoice: string };

export type SendResponse = { payment_id: string }; // hex 32 bytes（64 chars）

export type Bolt11SendUsingAmountRequest = { invoice: string; amount_msat: number };

export type CustomTlvDto = { type: number; value_hex: string };
export type SpontaneousSendRequest = {
  counterparty_node_id: string; // pubkey hex
  amount_msat: number; // u64
  custom_tlvs?: CustomTlvDto[];
};

export type PaymentDetailsDto = {
  id: string; // hex 32 bytes
  direction: 'Inbound' | 'Outbound';
  status: 'Pending' | 'Succeeded' | 'Failed';
  amount_msat: number | null; // u64 | null
  kind:
    | 'Bolt11'
    | 'Bolt11Jit'
    | 'Bolt12Offer'
    | 'Bolt12Refund'
    | 'Spontaneous'
    | 'Onchain';
  fee_paid_msat: number | null; // u64 | null
};

export type OutPointDto = { txid: string; vout: number };
export type EventDto =
  | {
      type: 'PaymentSuccessful';
      data: { payment_id: string | null; fee_paid_msat: number | null };
    }
  | { type: 'PaymentFailed'; data: { payment_id: string | null } }
  | { type: 'PaymentReceived'; data: { payment_id: string | null; amount_msat: number } }
  | { type: 'ChannelPending'; data: { funding_txo: OutPointDto } }
  | { type: 'ChannelReady'; data: { user_channel_id: string } }
  | { type: 'ChannelClosed'; data: Record<string, never> }
  | { type: 'Other'; data: { kind: string } };

/**
 * RGB Service interface
 */
export default interface IService {
  /**
   * Check the status of the node
   */
  healthz(): Promise<OkResponse>;

  /**
   * Check if the node is ready to accept requests
   */
  readyz(): Promise<OkResponse>;

  /**
   * Get the version of the node
   */
  version(): Promise<VersionResponse>;

  /**
   * Brief status information of the node
   */
  status(): Promise<StatusResponse>;

  /**
   * Get the public key of the node
   */
  node_id(): Promise<NodeIdResponse>;

  /**
   * Get the listening addresses of the node
   */
  listening_addresses(): Promise<ListeningAddressesResponse>;

  /**
   * Generate a new wallet address
   */
  new_address(): Promise<WalletNewAddressResponse>;

  /**
   * Sync the wallet balance and transactions
   */
  sync(): Promise<OkResponse>;

  /**
   * Get the wallet balances
   */
  balances(): Promise<BalancesResponse>;

  /**
   * List connected peers
   */
  peers(): Promise<PeerDetails[]>;

  /**
   * Open a new channel with a peer
   */
  open(body: OpenChannelRequest): Promise<OpenChannelResponse>;

  /**
   * Close an existing channel with a peer
   */
  close(body: CloseChannelRequest): Promise<OkResponse>;

  /**
   * Force close an existing channel with a peer
   */
  force_close(body: CloseChannelRequest): Promise<OkResponse>;

  /**
   * Create a fixed amount BOLT11 invoice
   */
  receive(body: Bolt11ReceiveRequest): Promise<Bolt11ReceiveResponse>;

  /**
   * Create a variable amount BOLT11 invoice
   */
  receive_var(body: Bolt11ReceiveVarRequest): Promise<Bolt11ReceiveResponse>;

  /**
   * Pay a BOLT11 invoice
   */
  send(body: Bolt11SendRequest): Promise<SendResponse>;

  /**
   * Pay a BOLT11 invoice using specified amount
   */
  send_using_amount(body: Bolt11SendUsingAmountRequest): Promise<SendResponse>;

  /**
   * Redirect payment msat to a public key
   */
  keysend(body: SpontaneousSendRequest): Promise<SendResponse>;

  get_payment(payment_id: string): Promise<PaymentDetailsDto>;

  wait_next(): Promise<EventDto>;

  /**
   * Acknowledge that the current event has been handled, and the node can proceed to the next one
   */
  handled(): Promise<OkResponse>;
}

/*
async function eventLoop(baseUrl: string, onEvent: (ev: EventDto) => Promise<void>) {
  while (true) {
    const ev = (await fetch(`${baseUrl}/api/v1/events/wait_next`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{}",
    }).then(r => r.json())) as EventDto;

    try {
      await onEvent(ev);
      await fetch(`${baseUrl}/api/v1/events/handled`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "{}",
      });
    } catch (e) {
      // 处理失败时不要调用 handled：这样下次 wait_next 仍会拿到同一条事件，便于重试（至少一次投递）。
      await new Promise(r => setTimeout(r, 500));
    }
  }
}
*/
