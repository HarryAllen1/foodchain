#!/usr/bin/env bash

chaincodeList() {
  if [ "$#" -ne 2 ]; then
    echo "Expected 2 parameters for chaincode list, but got: $*"
    exit 1

  elif [ "$1" = "peer0.farmer.foodchain.com" ]; then

    peerChaincodeList "cli.farmer.foodchain.com" "peer0.farmer.foodchain.com:7041" "$2" # $2 is channel name

  elif
    [ "$1" = "peer0.distributor.foodchain.com" ]
  then

    peerChaincodeList "cli.distributor.foodchain.com" "peer0.distributor.foodchain.com:7061" "$2" # $2 is channel name

  else

    echo "Fail to call listChaincodes. No peer or channel found. Provided peer: $1, channel: $2"
    exit 1

  fi
}

# Function to perform chaincode invoke. Accepts 5 parameters:
#   1. comma-separated peers
#   2. channel name
#   3. chaincode name
#   4. chaincode command
#   5. transient data (optional)
chaincodeInvoke() {
  if [ "$#" -ne 4 ] && [ "$#" -ne 5 ]; then
    echo "Expected 4 or 5 parameters for chaincode list, but got: $*"
    echo "Usage: fablo chaincode invoke <peer_domains_comma_separated> <channel_name> <chaincode_name> <command> [transient]"
    exit 1
  fi
  cli=""
  peer_addresses=""

  if [[ "$1" == *"peer0.farmer.foodchain.com"* ]]; then
    cli="cli.farmer.foodchain.com"
    peer_addresses="$peer_addresses,peer0.farmer.foodchain.com:7041"

  fi
  if [[ "$1" == *"peer0.distributor.foodchain.com"* ]]; then
    cli="cli.distributor.foodchain.com"
    peer_addresses="$peer_addresses,peer0.distributor.foodchain.com:7061"

  fi
  if [ -z "$peer_addresses" ]; then
    echo "Unknown peers: $1"
    exit 1
  fi

  peerChaincodeInvoke "$cli" "${peer_addresses:1}" "$2" "$3" "$4" "$5"

}
