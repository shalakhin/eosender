import {JsSignatureProvider} from 'eosjs/dist/eosjs-jssig'
import {Api, JsonRpc} from 'eosjs/dist'
import {TextDecoder, TextEncoder} from 'text-encoding'
const fetch = require('node-fetch')

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
const pushTransaction = async (config: any, flags: any, chunk: any) => {
  const defaultPrivateKey: string = config.sender.privateKey
  const signatureProvider = new JsSignatureProvider([defaultPrivateKey])
  const rpcUrl: string = config.uri
  const rpc = new JsonRpc(rpcUrl, {fetch})
  const api = new Api({
    rpc, signatureProvider,
    textDecoder: new TextDecoder(),
    textEncoder: new TextEncoder(),
  })

  const data = await api.transact({
    actions: chunk.actions,
  }, {
    blocksBehind: flags.blocks,
    expireSeconds: flags.expire,
  })
  return {
    data: data,
    chunk: chunk,
  }
}

export default pushTransaction
