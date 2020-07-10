import {Command, flags} from '@oclif/command'
import * as fs from 'fs'
import * as yaml from 'js-yaml'
import * as csv from 'csv-parser'
import { Api, JsonRpc, RpcError} from "eosjs/dist";
import { JsSignatureProvider} from "eosjs/dist/eosjs-jssig";
import { TextDecoder, TextEncoder } from "text-encoding";
import * as chalk from 'chalk';
const fetch = require('node-fetch');

class Eosender extends Command {
  static description = 'send mutiple transfer actions within one transaction'

  static flags = {
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    config: flags.string({char: 'c', description: 'override default path to the config'}),
    detailed: flags.boolean({char: 'd', description: 'display detailed information', default: false})
  }

  static args = [
    {
      name: 'file',
      required: true,
      description: 'actions file',
    }
  ]

  async run() {
    const {args, flags} = this.parse(Eosender)

    const configPath = flags.config || `${process.env.HOME}/.eosender.yml`
    const file = args.file
    const config: any = yaml.safeLoad(fs.readFileSync(configPath, 'utf8'))

    const filePath: string = `${process.cwd()}/${file}`
    const actions: any = []
    const headers = [
      'username',
      'contract',
      'amount',
      'tokenName',
      'memo'
    ]
    fs.createReadStream(filePath)
      .pipe(csv(headers))
      .on('data', (data) => {
        actions.push({
          account: data.contract,
          name: 'transfer',
            authorization: [{
            actor: config.sender.username,
            permission: 'active',
          }],
            data: {
              from: config.sender.username,
              to: data.username,
              quantity: `${data.amount} ${data.tokenName}`,
              memo: data.memo,
          },
        })
      })
      .on('end', () => {

        let defaultPrivateKey:string = config.sender.privateKey;
        const signatureProvider = new JsSignatureProvider([defaultPrivateKey]);
        let rpcUrl:string = config.uri;
        const rpc = new JsonRpc(rpcUrl, { fetch });
        const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

        const pushTransaction = async () => {
          const result = await api.transact({
            actions: actions
          }, {
            blocksBehind: 3,
            expireSeconds: 30,
          })
          this.log(`Transaction ID:\n\n${chalk.green(result.transaction_id)}\n`)
          if (flags.detailed) {
            this.log('Data:\n')
            this.log(chalk.green(JSON.stringify(result, null, 2)))
          }
        }
        pushTransaction()
      })
  }
}

export = Eosender
