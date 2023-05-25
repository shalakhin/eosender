const packAction = (config: any, data: any, actionType: string) => {
  let actionData: any
  if (actionType === 'transfer') {
    const amount: string = data.amount
    actionData = {
      from: config.sender.username,
      to: data.username,
      quantity: `${amount} ${data.tokenName}`,
      memo: data.memo,
    }
  } else if (actionType === 'setinhdate') {
    actionData = {
      owner: data.owner,
      inactive_period: parseInt(data.date, 0),
    }
  } else if (actionType === 'dstrinh') {
    actionData = {
      initiator: data.initiator,
      inheritance_owner: data.inheritance_owner,
      token: data.token,
    }
  } else {
    throw new Error('unknown action type')
  }

  return {
    account: data.contract,
    name: actionType,
    authorization: [{
      actor: config.sender.username,
      permission: 'active',
    }],
    data: actionData,
  }
}

export default packAction
