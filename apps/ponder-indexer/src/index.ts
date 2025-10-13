import { ponder } from 'ponder:registry';

ponder.on('idrissTippingEthereum:TipMessage', async ({ event, context }) => {
  console.log('Ethereum tip:', event.args);
});

ponder.on('idrissTippingBase:TipMessage', async ({ event, context }) => {
  console.log('Base tip:', event.args);
});
