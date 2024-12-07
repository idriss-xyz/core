import { createLookup } from 'shared/utils';

export const SNAPSHOT_WEBSITE_URL = 'https://snapshot.org';
export const SNAPSHOT_GRAPHQL_API_URL = 'https://hub.snapshot.org/graphql?';

export const FARCASTER_HANDLE_TO_SNAPSHOT: Record<string, string> = {
  '1inchnetwork': '1inch.eth',
  'aave': 'aave.eth',
  'aavegotchi': 'aavegotchi.eth',
  'acrossprotocol': 'acrossprotocol.eth',
  'apecoin': 'apecoin.eth',
  'arbitrum': 'arbitrumfoundation.eth',
  'balancer': 'balancer.eth',
  'bankless': 'banklessvault.eth',
  'dcl': 'snapshot.dcl.eth',
  'echelon': 'echelonassembly.eth',
  'ens': 'ens.eth',
  'ensdomains': 'ens.eth',
  'galxe': 'gal.eth',
  'gearboxprotocol': 'gearbox.eth',
  'gitcoin': 'gitcoindao.eth',
  'idriss': 'idrissxyz.eth',
  'juicebox': 'jbdao.eth',
  'kwenta': 'kwenta.eth',
  'kwentaeth': 'kwenta.eth',
  'lido': 'lido-snapshot.eth',
  'lidofinance': 'lido-snapshot.eth',
  'linea': 'linea-build.eth',
  'metis': 'metislayer2.eth',
  'olassians': 'autonolas.eth',
  'optimism': 'citizenshouse.eth',
  'paragonsdao': 'paragonsdao.eth',
  'parallel': 'echelonassembly.eth',
  'paralleltcg': 'echelonassembly.eth',
  'pool-together': 'pooltogether.eth',
  'pooltogether': 'pooltogether.eth',
  'safe': 'safe.eth',
  'starknet': 'starknet.eth',
  'threshold': 'threshold.eth',
  'uniswap': 'uniswapgovernance.eth',
  'unlock-protocol': 'unlock-protocol.eth',
  'wayfinder': 'wayfinderfoundation.eth',
};

export const EVENT = createLookup(['SNAPSHOT_VOTE_CLICKED']);
