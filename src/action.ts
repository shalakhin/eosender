const packAction = (config: any, data: any) => {
  let amount: number = data.amount
  if (config.pcash && config.pcash === true) {
    if (data.amount == 0.00001) {
      amount = (Math.ceil(data.amount / 0.9975 * 10**5))/10**5
    } else {
      amount = (Math.floor(data.amount / 0.9975 * 10**5))/10**5
    }
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

