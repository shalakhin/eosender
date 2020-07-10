import {Command, flags} from '@oclif/command'
import * as fs from 'fs'
import * as yaml from 'js-yaml'
import * as csv from 'csv-parser'

class Eosender extends Command {
  static description = 'send mutiple transfer actions within one transaction'

  static flags = {
    version: flags.version({char: 'v'}),
    help: flags.help({char: 'h'}),
    config: flags.string({char: 'c', description: 'override default path to the config'})
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
    const actionsData: any = []
    const headers = [
      'username',
      'contract',
      'amount',
      'tokenName',
      'memo'
    ]
    fs.createReadStream(filePath)
      .pipe(csv(headers))
      .on('data', (data) => actionsData.push(data))
      .on('end', () => {
        this.log(actionsData)
      })
  }
}

export = Eosender
