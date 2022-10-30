import {Command, flags} from '@oclif/command'
import * as fs from 'fs'
import * as yaml from 'js-yaml'
import * as csv from 'csv-parser'
import * as chalk from 'chalk'
import processActions from './manager'
import packAction from './action'

class Eosender extends Command {
  static description = 'send multiple transfer actions within one transaction'

  static flags = {
    version: flags.version({char: 'v'}),
    expire: flags.integer({char: 'x', description: 'expiration seconds for the transaction', default: 60}),
    chunks: flags.integer({description: 'how large must chunks be', default: 100}),
    blocks: flags.integer({char: 'b', description: 'blocks behind', default: 3}),
    pcash: flags.boolean({char: 'p', description: 'consider pcash tokens fee', default: false}),
    help: flags.help({char: 'h'}),
    config: flags.string({char: 'c', description: 'override default path to the config', default: `${process.env.HOME}/.eosender.yml`}),
    detailed: flags.boolean({char: 'd', description: 'display detailed information', default: false}),
    actionType: flags.string({char: 'a', description: 'action type - transfer, setinhdate, dstrinh', default: 'transfer'}),
  }

  static args = [
    {
      name: 'file',
      required: true,
      description: 'actions file',
    },
  ]

  async run() {
    const {args, flags} = this.parse(Eosender)

    const file = args.file
    const config: any = yaml.safeLoad(fs.readFileSync(flags.config, 'utf8'))
    const filePath: string = file
    const actionsList: any = []

    let headers: Array<string> = []

    if (flags.actionType === 'transfer') {
      headers = [
        'username',
        'contract',
        'amount',
        'tokenName',
        'memo',
      ]
    } else if (flags.actionType === 'setinhdate') {
      headers = [
        'contract',
        'action',
        'owner',
        'date',
      ]
    } else if (flags.actionType === 'dstrinh') {
      headers = [
        'contract',
        'action',
        'initiator',
        'inheritance_owner',
        'token',
      ]
    } else {
      throw new Error('unknown action')
    }

    fs.createReadStream(filePath)
    .pipe(csv({headers: headers, separator: ','}))
    .on('data', data => {
      if (data.username !== undefined) {
        actionsList.push(packAction(config, data, flags.actionType))
      }
    })
    .on('end', () => {
      processActions(config, file, flags, actionsList)
    })
  }
}

export = Eosender
