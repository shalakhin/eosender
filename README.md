eosender
========

multiple sending tokens with EOS blockchain. The goal for this CLI command is to execute multiple actions within one transaction

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/eosender.svg)](https://npmjs.org/package/eosender)
[![Downloads/week](https://img.shields.io/npm/dw/eosender.svg)](https://npmjs.org/package/eosender)
[![License](https://img.shields.io/npm/l/eosender.svg)](https://github.com/shalakhin/eosender/blob/master/package.json)


## install

1. Install it with npm

```bash
npm install -g eosender
```

2. setup config

By default, it will be searched at `$HOME` folder as `$HOME/.eosender.yml` but you can override it with `eosender --config <path-to-config>` 

```yaml
- uri: some-eos-node-url 
- sender:
  - name: username
  - privateKey: privateKey
```

## usage

```bash
eosender <path/to/file>
```

file format:

```csv
username1,contract,amount,tokenName,memo
```

file example:

```csv
user1,10.0000,eosio.token,EOS,nice memo here
user2,10.0000,eosio.token,SYS,super-duper
user3,100.00,eos.usdt,USDT,
```
