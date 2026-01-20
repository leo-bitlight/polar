// import IService, {
//   BalancesResponse,
//   Bolt11ReceiveRequest,
//   Bolt11ReceiveResponse,
//   Bolt11ReceiveVarRequest,
//   Bolt11SendRequest,
//   Bolt11SendUsingAmountRequest,
//   CloseChannelRequest,
//   EventDto,
//   ListeningAddressesResponse,
//   NodeIdResponse,
//   OkResponse,
//   OpenChannelRequest,
//   OpenChannelResponse,
//   PaymentDetailsDto,
//   PeerDetails,
//   SendResponse,
//   SpontaneousSendRequest,
//   StatusResponse,
//   VersionResponse,
//   WalletNewAddressResponse,
// } from './IService';

// export default class RgbService implements IService {
//   healthz(): Promise<OkResponse> {
//     throw new Error('Method not implemented.');
//   }
//   readyz(): Promise<OkResponse> {
//     throw new Error('Method not implemented.');
//   }
//   version(): Promise<VersionResponse> {
//     throw new Error('Method not implemented.');
//   }
//   status(): Promise<StatusResponse> {
//     throw new Error('Method not implemented.');
//   }
//   node_id(): Promise<NodeIdResponse> {
//     throw new Error('Method not implemented.');
//   }
//   listening_addresses(): Promise<ListeningAddressesResponse> {
//     throw new Error('Method not implemented.');
//   }
//   new_address(): Promise<WalletNewAddressResponse> {
//     throw new Error('Method not implemented.');
//   }
//   sync(): Promise<OkResponse> {
//     throw new Error('Method not implemented.');
//   }
//   balances(): Promise<BalancesResponse> {
//     throw new Error('Method not implemented.');
//   }
//   peers(): Promise<PeerDetails[]> {
//     throw new Error('Method not implemented.');
//   }
//   open(body: OpenChannelRequest): Promise<OpenChannelResponse> {
//     body;
//     throw new Error('Method not implemented.');
//   }
//   close(body: CloseChannelRequest): Promise<OkResponse> {
//     body;
//     throw new Error('Method not implemented.');
//   }
//   force_close(body: CloseChannelRequest): Promise<OkResponse> {
//     body;
//     throw new Error('Method not implemented.');
//   }
//   receive(body: Bolt11ReceiveRequest): Promise<Bolt11ReceiveResponse> {
//     body;
//     throw new Error('Method not implemented.');
//   }
//   receive_var(body: Bolt11ReceiveVarRequest): Promise<Bolt11ReceiveResponse> {
//     body;
//     throw new Error('Method not implemented.');
//   }
//   send(body: Bolt11SendRequest): Promise<SendResponse> {
//     body;
//     throw new Error('Method not implemented.');
//   }
//   send_using_amount(body: Bolt11SendUsingAmountRequest): Promise<SendResponse> {
//     body;
//     throw new Error('Method not implemented.');
//   }
//   keysend(body: SpontaneousSendRequest): Promise<SendResponse> {
//     body;
//     throw new Error('Method not implemented.');
//   }
//   get_payment(payment_id: string): Promise<PaymentDetailsDto> {
//     payment_id;
//     throw new Error('Method not implemented.');
//   }
//   wait_next(): Promise<EventDto> {
//     throw new Error('Method not implemented.');
//   }
//   handled(): Promise<OkResponse> {
//     throw new Error('Method not implemented.');
//   }
// }
