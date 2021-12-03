// @ts-check
const { ApiPromise, WsProvider } = require('@polkadot/api');
const { typesBundle } = require('@subsocial/types');

const wsProviderUrl = 'wss://rpc.subsocial.network';

const main = async () => {
  const provider = new WsProvider(wsProviderUrl);
  const api = await ApiPromise.create({ provider, typesBundle });
  await api.isReady;
};
main().catch((error) => console.log(error));
