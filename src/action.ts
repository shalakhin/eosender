const packAction = (config: any, data: any) => {
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
      quantity: `${data.amount} ${data.tokenName}`,
      memo: data.memo,
    },
  }
}

export default packAction;

