#!/usr/bin/env bash

source "$FABLO_NETWORK_ROOT/fabric-docker/scripts/channel-query-functions.sh"

set -eu

channelQuery() {
  echo "-> Channel query: " + "$@"

  if [ "$#" -eq 1 ]; then
    printChannelsHelp

  elif [ "$1" = "list" ] && [ "$2" = "farmers" ] && [ "$3" = "peer0" ]; then

    peerChannelList "cli.farmer.foodchain.com" "peer0.farmer.foodchain.com:7041"

  elif
    [ "$1" = "list" ] && [ "$2" = "distributors" ] && [ "$3" = "peer0" ]
  then

    peerChannelList "cli.distributor.foodchain.com" "peer0.distributor.foodchain.com:7061"

  elif

    [ "$1" = "getinfo" ] && [ "$2" = "my-channel1" ] && [ "$3" = "farmers" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfo "my-channel1" "cli.farmer.foodchain.com" "peer0.farmer.foodchain.com:7041"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "my-channel1" ] && [ "$4" = "farmers" ] && [ "$5" = "peer0" ]; then
    TARGET_FILE=${6:-"$channel-config.json"}

    peerChannelFetchConfig "my-channel1" "cli.farmer.foodchain.com" "$TARGET_FILE" "peer0.farmer.foodchain.com:7041"

  elif [ "$1" = "fetch" ] && [ "$3" = "my-channel1" ] && [ "$4" = "farmers" ] && [ "$5" = "peer0" ]; then
    BLOCK_NAME=$2
    TARGET_FILE=${6:-"$BLOCK_NAME.block"}

    peerChannelFetchBlock "my-channel1" "cli.farmer.foodchain.com" "${BLOCK_NAME}" "peer0.farmer.foodchain.com:7041" "$TARGET_FILE"

  elif
    [ "$1" = "getinfo" ] && [ "$2" = "my-channel1" ] && [ "$3" = "distributors" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfo "my-channel1" "cli.distributor.foodchain.com" "peer0.distributor.foodchain.com:7061"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "my-channel1" ] && [ "$4" = "distributors" ] && [ "$5" = "peer0" ]; then
    TARGET_FILE=${6:-"$channel-config.json"}

    peerChannelFetchConfig "my-channel1" "cli.distributor.foodchain.com" "$TARGET_FILE" "peer0.distributor.foodchain.com:7061"

  elif [ "$1" = "fetch" ] && [ "$3" = "my-channel1" ] && [ "$4" = "distributors" ] && [ "$5" = "peer0" ]; then
    BLOCK_NAME=$2
    TARGET_FILE=${6:-"$BLOCK_NAME.block"}

    peerChannelFetchBlock "my-channel1" "cli.distributor.foodchain.com" "${BLOCK_NAME}" "peer0.distributor.foodchain.com:7061" "$TARGET_FILE"

  else

    echo "$@"
    echo "$1, $2, $3, $4, $5, $6, $7, $#"
    printChannelsHelp
  fi

}

printChannelsHelp() {
  echo "Channel management commands:"
  echo ""

  echo "fablo channel list farmers peer0"
  echo -e "\t List channels on 'peer0' of 'Farmers'".
  echo ""

  echo "fablo channel list distributors peer0"
  echo -e "\t List channels on 'peer0' of 'Distributors'".
  echo ""

  echo "fablo channel getinfo my-channel1 farmers peer0"
  echo -e "\t Get channel info on 'peer0' of 'Farmers'".
  echo ""
  echo "fablo channel fetch config my-channel1 farmers peer0 [file-name.json]"
  echo -e "\t Download latest config block and save it. Uses first peer 'peer0' of 'Farmers'".
  echo ""
  echo "fablo channel fetch <newest|oldest|block-number> my-channel1 farmers peer0 [file name]"
  echo -e "\t Fetch a block with given number and save it. Uses first peer 'peer0' of 'Farmers'".
  echo ""

  echo "fablo channel getinfo my-channel1 distributors peer0"
  echo -e "\t Get channel info on 'peer0' of 'Distributors'".
  echo ""
  echo "fablo channel fetch config my-channel1 distributors peer0 [file-name.json]"
  echo -e "\t Download latest config block and save it. Uses first peer 'peer0' of 'Distributors'".
  echo ""
  echo "fablo channel fetch <newest|oldest|block-number> my-channel1 distributors peer0 [file name]"
  echo -e "\t Fetch a block with given number and save it. Uses first peer 'peer0' of 'Distributors'".
  echo ""

}
