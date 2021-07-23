const packAction = (config: any, data: any) => {
  let amount: string = data.amount
  if (config.pcash && config.pcash === true) {
    let amountWithFee: number
    if (data.amount == 0.00001) {
      amountWithFee = (Math.ceil(data.amount / 0.9975 * 10**5))/10**5
    } else {
      amountWithFee = (Math.floor(data.amount / 0.9975 * 10**5))/10**5
    }

    amount = amountWithFee.toFixed(5)
  }
  return {
    account: data.contract,
    name: 'transfer',
    authorization: [{
      actor: config.sender.username,
      permission: 'active',
    }],
    data: {
      from: config.sender.username,
      to: data.username,
      quantity: `${amount} ${data.tokenName}`,
      memo: data.memo,
    },
  }
}

export default packAction;

