import {JsSignatureProvider} from "eosjs/dist/eosjs-jssig";
import {Api, JsonRpc} from "eosjs/dist";
import {TextDecoder, TextEncoder} from "text-encoding";
const fetch = require('node-fetch');
import * as chalk from "chalk";

const pushTransaction = async (config: any, flags: any, chunk: any) => {
  let defaultPrivateKey:string = config.sender.privateKey;
  const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);
  let rpcUrl:string = config.uri;
  const rpc = new JsonRpc(rpcUrl, { fetch });
  const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

  const data = await api.transact({
    actions: chunk.actions
  }, {
    blocksBehind: flags.blocks,
    expireSeconds: flags.expire,
  })
  return {
    data: data,
    chunk: chunk
  }

  // console.log(`transaction id: ${chalk.green(result.transaction_id)}\n`)
  // if (flags.detailed) {
  //   this.log('Data:\n')
  //   this.log(chalk.green(JSON.stringify(result, null, 2)))
  // }
}

export default pushTransaction;
