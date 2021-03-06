import * as fs from 'fs'
import * as chalk from "chalk";
import pushTransaction from "./transaction";

const processActions = async (config: any, file: string, flags: any, actions: any ) => {
  const chunksNumber: number = Math.ceil(actions.length / flags.chunks)

  console.log(`${chalk.cyan("Processing")} ${chunksNumber} chunks for ${actions.length} transfers`)

  let chunks: Array<any> = []
  for (let i = 0; i < chunksNumber; i++) {
    chunks.push({
      no: i,
      actions: actions.slice(i * flags.chunks, i * flags.chunks + flags.chunks)
    })
  }


  const starterPromise = Promise.resolve(null);
  const log = (result: any) => {
    const first: string = result.chunk.actions[0].data.to
    const last: string = result.chunk.actions[result.chunk.actions.length - 1].data.to
    console.log(`chunk ${result.chunk.no}\t${first}....${last} \t\t→ ${chalk.green(result.data.transaction_id)}`);
    return result
  }
  const toDone = (result: any) => {
    let stream = fs.createWriteStream(`${file}_done`, {flags: 'a'})
    result.chunk.actions.forEach((action: any) => {
      stream.write(`${action.data.to},${action.account},${action.data.quantity.split(' ')[0]},${action.data.quantity.split(' ')[1]},${action.data.memo},${result.data.transaction_id}\n`)
    })
    stream.end()
  }
  chunks.reduce(
    (p, chunk) => p.then(() => {
        pushTransaction(config, flags, chunk).then(log).then(toDone).catch(e => {
          console.log(chalk.red(e))
          let stream = fs.createWriteStream(`${file}_failed`, {flags: 'a'})
          chunk.actions.forEach((action: any) => {
            stream.write(`${action.data.to},${action.account},${action.data.quantity.split(' ')[0]},${action.data.quantity.split(' ')[1]},${action.data.memo}\n`)
          })
          stream.end()
        })
    }),
    starterPromise
  )
}

export default processActions;
