import * as fs from 'fs'
import * as chalk from 'chalk'
import pushTransaction from './transaction'

const processActions = async (config: any, file: string, flags: any, actions: any ) => {
  const chunksNumber: number = Math.ceil(actions.length / flags.chunks)

  // eslint-disable-next-line no-console
  console.log(`${chalk.cyan('Processing')} ${chunksNumber} chunks for ${actions.length} transfers`)

  const chunks: Array<any> = []
  for (let i = 0; i < chunksNumber; i++) {
    chunks.push({
      no: i,
      // eslint-disable-next-line no-mixed-operators
      actions: actions.slice(i * flags.chunks, i * flags.chunks + flags.chunks),
    })
  }

  const toDone = (result: any) => {
    const stream = fs.createWriteStream(`${file}_done`, {flags: 'a'})
    result.chunk.actions.forEach((action: any) => {
      stream.write(`${action.data.to},${action.account},${action.data.quantity.split(' ')[0]},${action.data.quantity.split(' ')[1]},${action.data.memo},${result.data.transaction_id}\n`)
    })
    stream.end()
  }

  const wait = (ms: number) => new Promise(res => setTimeout(() => res(''), ms))

  for (const chunk of chunks) {
    // eslint-disable-next-line unicorn/catch-error-name
    try {
      const result = await pushTransaction(config, flags, chunk)
      const first: string = result.chunk.actions[0].data.to
      const last: string = result.chunk.actions[result.chunk.actions.length - 1].data.to
      // eslint-disable-next-line no-console
      console.log(`chunk ${result.chunk.no}\t${first}....${last} \t\t→ ${chalk.green(result.data.transaction_id)}`)
      toDone(result)
      // eslint-disable-next-line unicorn/catch-error-name
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(chalk.red(e))
      const stream = fs.createWriteStream(`${file}_failed`, {flags: 'a'})
      chunk.actions.forEach((action: any) => {
        stream.write(`${action.data.to},${action.account},${action.data.quantity.split(' ')[0]},${action.data.quantity.split(' ')[1]},${action.data.memo}\n`)
      })
      stream.end()
    }
    await wait(1000)
  }
}

export default processActions
