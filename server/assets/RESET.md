## Reset Blockchain

- Default `bitcoin.conf` location: `/home/ubuntu/.bitcoin/bitcoin.conf`
- Delete blocks and chain state: `rm -rf ~/.bitcoin/regtest/blocks ~/.bitcoin/regtest/chainstate`
- Delete transactions: `rm -rf ~/.bitcoin/regtest/indexes/txindex`
- Connect to SSH: `ssh -i "bitcoin-core.pem" ubuntu@INSTANCE_PRIVATE_IP`
