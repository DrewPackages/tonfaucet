const paramsSchema = {
  properties: {
    name: {
      type: "string",
    },
    symbol: {
      type: "string",
    },
    image: {
      type: "string",
      format: "uri",
    },
    description: {
      type: "string",
    },
    network: {
      type: "string",
      enum: ["testnet", "mainnet"],
    },
  },
  required: ["name", "symbol", "network"],
};

function deploy(params) {
  const [address] = api.blueprint.script({
    envs: {
      TOKEN_NAME: params.name,
      TOKEN_SYMBOL: params.symbol,
      TOKEN_DESCRIPTION: params.description,
      TOKEN_IMAGE:
        params.image ||
        "https://assets.transak.com/images/cryptoCurrency/notcoin_large.jpg",
    },
    workdir: "onchain",
    outputs: [
      {
        name: "address",
        extract: {
          type: "regex",
          expr: "Contract deployed at address (?<address>[A-Za-z0-9_-]+)",
          groupName: "address",
        },
      },
    ],
  });

  api.offchain.deploy({
    details: {
      envs: {
        TOKEN_ADDRESS: address,
        NETWORK: params.network,
      },
      flags: {
        build: true,
      },
    },
  });
}
