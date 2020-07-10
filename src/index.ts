import {Command, flags} from '@oclif/command'
import * as fs from 'fs'
import * as yaml from 'js-yaml'

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

    const config = flags.config || `${process.env.HOME}/.eosender.yml`
    const file = args.file
    const data: any = yaml.safeLoad(fs.readFileSync(config, 'utf8'))


  }
}

export = Eosender
