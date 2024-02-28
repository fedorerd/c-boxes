include .env

deploy:
	anchor deploy --program-name c-boxes --provider.wallet ${PROVIDER_KEYPAIR} --program-keypair ${PROGRAM_KEYPAIR} --provider.cluster ${RPC_URL}

create:
	anchor run create --provider.wallet ${PROVIDER_KEYPAIR} --provider.cluster ${RPC_URL}

withdraw:
	anchor run withdraw --provider.wallet ${PROVIDER_KEYPAIR} --provider.cluster ${RPC_URL}