// @ts-check
const pino = require('pino');
const { decodeAddress, encodeAddress } = require('@polkadot/keyring');
const { hexToU8a, isHex } = require('@polkadot/util');
const _ = require('lodash');

const logger = pino();

module.exports = {
  formatNumber: (number) => (number.toString()).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'),
  shortHash: (hash) => `${hash.substr(0, 6)}…${hash.substr(hash.length - 5, 4)}`,
  wait: async (ms) => new Promise((resolve) => {
    setTimeout(resolve, ms);
  }),
  isValidAddressPolkadotAddress: (address) => {
    try {
      encodeAddress(
        isHex(address)
          ? hexToU8a(address.toString())
          : decodeAddress(address),
      );
      return true;
    } catch (error) {
      return false;
    }
  },
  updateBalances: async (api, pool, blockNumber, timestamp, loggerOptions, blockEvents) => {
    const involvedAddresses = [];
    blockEvents
      .forEach(({ event }) => {
        event.data.forEach((arg) => {
          if (module.exports.isValidAddressPolkadotAddress(arg)) {
            involvedAddresses.push(arg);
          }
        });
      });
    const uniqueAddresses = _.uniq(involvedAddresses);
    logger.info(loggerOptions, `Block #${blockNumber} involved addresses: ${uniqueAddresses.join(', ')}`);
    // eslint-disable-next-line no-restricted-syntax
    for (const address of uniqueAddresses) {
      // eslint-disable-next-line no-await-in-loop
      const [balances, { identity }] = await Promise.all([
        api.derive.balances.all(address),
        api.derive.accounts.info(address),
      ]);
      const availableBalance = balances.availableBalance.toString();
      const freeBalance = balances.freeBalance.toString();
      const lockedBalance = balances.lockedBalance.toString();
      const identityDisplay = identity.display ? identity.display.toString() : '';
      const identityDisplayParent = identity.displayParent ? identity.displayParent.toString() : '';
      const JSONIdentity = identity.display ? JSON.stringify(identity) : '';
      const JSONbalances = JSON.stringify(balances);
      const nonce = balances.accountNonce.toString();
      const sql = `
        INSERT INTO   account (account_id, identity, identity_display, identity_display_parent, balances, available_balance, free_balance, locked_balance, nonce, timestamp, block_height)
        VALUES        ('${address}', '${JSONIdentity}', '${identityDisplay}', '${identityDisplayParent}', '${JSONbalances}', '${availableBalance}', '${freeBalance}', '${lockedBalance}', '${nonce}', '${timestamp}', '${blockNumber}')
        ON CONFLICT   (account_id)
        DO UPDATE
        SET           identity = EXCLUDED.identity,
                      identity_display = EXCLUDED.identity_display,
                      identity_display_parent = EXCLUDED.identity_display_parent,
                      balances = EXCLUDED.balances,
                      available_balance = EXCLUDED.available_balance,
                      free_balance = EXCLUDED.free_balance,
                      locked_balance = EXCLUDED.locked_balance,
                      nonce = EXCLUDED.nonce,
                      timestamp = EXCLUDED.timestamp,
                      block_height = EXCLUDED.block_height;
      `;
      try {
        // eslint-disable-next-line no-await-in-loop
        await pool.query(sql);
        logger.error(loggerOptions, `New balances for address ${address}: available: ${availableBalance}, free: ${freeBalance}, locked: ${lockedBalance}`);
      } catch (error) {
        logger.error(loggerOptions, `Error updating balances for involved address: ${JSON.stringify(error)}`);
      }
    }
    logger.info(loggerOptions, `Updated balances of addresses: ${uniqueAddresses.join(', ')}`);
  },
  storeExtrinsics: async (pool, blockNumber, extrinsics, blockEvents, timestamp, loggerOptions) => {
    const startTime = new Date().getTime();
    extrinsics.forEach(async (extrinsic, index) => {
      const { isSigned } = extrinsic;
      const signer = isSigned ? extrinsic.signer.toString() : '';
      const { section } = extrinsic.toHuman().method;
      const { method } = extrinsic.toHuman().method;
      const args = JSON.stringify(extrinsic.args);
      const hash = extrinsic.hash.toHex();
      const doc = extrinsic.meta.doc.toString().replace(/'/g, "''");
      const success = module.exports.getExtrinsicSuccess(index, blockEvents);
      const sql = `INSERT INTO extrinsic (
          block_number,
          extrinsic_index,
          is_signed,
          signer,
          section,
          method,
          args,
          hash,
          doc,
          success,
          timestamp
        ) VALUES (
          '${blockNumber}',
          '${index}',
          '${isSigned}',
          '${signer}',
          '${section}',
          '${method}',
          '${args}',
          '${hash}',
          '${doc}',
          '${success}',
          '${timestamp}'
        )
        ON CONFLICT ON CONSTRAINT extrinsic_pkey 
        DO NOTHING;
        ;`;
      try {
        await pool.query(sql);
        logger.info(loggerOptions, `Added extrinsic ${blockNumber}-${index} (${module.exports.shortHash(hash)}) ${section} ➡ ${method}`);
      } catch (error) {
        logger.error(loggerOptions, `Error adding extrinsic ${blockNumber}-${index}: ${JSON.stringify(error)}`);
      }
    });

    // Log execution time
    const endTime = new Date().getTime();
    logger.info(loggerOptions, `Added ${extrinsics.length} extrinsics in ${((endTime - startTime) / 1000).toFixed(3)}s`);
  },
  getExtrinsicSuccess: (index, blockEvents) => {
    // assume success if no events were extracted
    if (blockEvents.length === 0) {
      return true;
    }
    let extrinsicSuccess = false;
    blockEvents.forEach((record) => {
      const { event, phase } = record;
      if (
        parseInt(phase.toHuman().ApplyExtrinsic, 10) === index
        && event.section === 'system'
        && event.method === 'ExtrinsicSuccess'
      ) {
        extrinsicSuccess = true;
      }
    });
    return extrinsicSuccess;
  },
  getDisplayName: (identity) => {
    if (
      identity.displayParent
      && identity.displayParent !== ''
      && identity.display
      && identity.display !== ''
    ) {
      return `${identity.displayParent} / ${identity.display}`;
    }
    return identity.display || '';
  },
  updateTotals: async (pool, loggerOptions) => {
    const sql = `
        UPDATE total SET count = (SELECT count(*) FROM block) WHERE name = 'blocks';
        UPDATE total SET count = (SELECT count(*) FROM extrinsic) WHERE name = 'extrinsics';
        UPDATE total SET count = (SELECT count(*) FROM extrinsic WHERE section = 'balances' and method = 'transfer' ) WHERE name = 'transfers';
        UPDATE total SET count = (SELECT count(*) FROM event) WHERE name = 'events';
      `;
    try {
      await pool.query(sql);
    } catch (error) {
      logger.error(loggerOptions, `Error updating total harvested blocks, extrinsics and events: ${error}`);
    }
  }
};
