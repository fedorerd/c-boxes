include .env

deploy:
	anchor deploy --program-name c-boxes --provider.wallet ${PROVIDER_KEYPAIR} --program-keypair ${PROGRAM_KEYPAIR} --provider.cluster ${RPC_URL}

create:
	anchor run create --provider.wallet ${PROVIDER_KEYPAIR} --provider.cluster ${RPC_URL}

withdraw:
	anchor run withdraw --provider.wallet ${PROVIDER_KEYPAIR} --provider.cluster ${RPC_URL}

dump_programs:
	solana program dump cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK .anchor/spl_compression.so
	solana program dump BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY .anchor/bubblegum.so
	solana program dump noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV .anchor/noop.so