#!/usr/bin/env bash

source "$FABLO_NETWORK_ROOT/fabric-docker/scripts/channel-query-functions.sh"

set -eu

channelQuery() {
  echo "-> Channel query: " + "$@"

  if [ "$#" -eq 1 ]; then
    printChannelsHelp

  elif [ "$1" = "list" ] && [ "$2" = "main" ] && [ "$3" = "peer0" ]; then

    peerChannelList "cli.main.foodchain.com" "peer0.main.foodchain.com:7021"

  elif
    [ "$1" = "list" ] && [ "$2" = "main" ] && [ "$3" = "peer1" ]
  then

    peerChannelList "cli.main.foodchain.com" "peer1.main.foodchain.com:7022"

  elif
    [ "$1" = "list" ] && [ "$2" = "main" ] && [ "$3" = "peer2" ]
  then

    peerChannelList "cli.main.foodchain.com" "peer2.main.foodchain.com:7023"

  elif

    [ "$1" = "getinfo" ] && [ "$2" = "supplychain" ] && [ "$3" = "main" ] && [ "$4" = "peer0" ]
  then

    peerChannelGetInfo "supplychain" "cli.main.foodchain.com" "peer0.main.foodchain.com:7021"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "supplychain" ] && [ "$4" = "main" ] && [ "$5" = "peer0" ]; then
    TARGET_FILE=${6:-"$channel-config.json"}

    peerChannelFetchConfig "supplychain" "cli.main.foodchain.com" "$TARGET_FILE" "peer0.main.foodchain.com:7021"

  elif [ "$1" = "fetch" ] && [ "$3" = "supplychain" ] && [ "$4" = "main" ] && [ "$5" = "peer0" ]; then
    BLOCK_NAME=$2
    TARGET_FILE=${6:-"$BLOCK_NAME.block"}

    peerChannelFetchBlock "supplychain" "cli.main.foodchain.com" "${BLOCK_NAME}" "peer0.main.foodchain.com:7021" "$TARGET_FILE"

  elif
    [ "$1" = "getinfo" ] && [ "$2" = "supplychain" ] && [ "$3" = "main" ] && [ "$4" = "peer1" ]
  then

    peerChannelGetInfo "supplychain" "cli.main.foodchain.com" "peer1.main.foodchain.com:7022"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "supplychain" ] && [ "$4" = "main" ] && [ "$5" = "peer1" ]; then
    TARGET_FILE=${6:-"$channel-config.json"}

    peerChannelFetchConfig "supplychain" "cli.main.foodchain.com" "$TARGET_FILE" "peer1.main.foodchain.com:7022"

  elif [ "$1" = "fetch" ] && [ "$3" = "supplychain" ] && [ "$4" = "main" ] && [ "$5" = "peer1" ]; then
    BLOCK_NAME=$2
    TARGET_FILE=${6:-"$BLOCK_NAME.block"}

    peerChannelFetchBlock "supplychain" "cli.main.foodchain.com" "${BLOCK_NAME}" "peer1.main.foodchain.com:7022" "$TARGET_FILE"

  elif
    [ "$1" = "getinfo" ] && [ "$2" = "supplychain" ] && [ "$3" = "main" ] && [ "$4" = "peer2" ]
  then

    peerChannelGetInfo "supplychain" "cli.main.foodchain.com" "peer2.main.foodchain.com:7023"

  elif [ "$1" = "fetch" ] && [ "$2" = "config" ] && [ "$3" = "supplychain" ] && [ "$4" = "main" ] && [ "$5" = "peer2" ]; then
    TARGET_FILE=${6:-"$channel-config.json"}

    peerChannelFetchConfig "supplychain" "cli.main.foodchain.com" "$TARGET_FILE" "peer2.main.foodchain.com:7023"

  elif [ "$1" = "fetch" ] && [ "$3" = "supplychain" ] && [ "$4" = "main" ] && [ "$5" = "peer2" ]; then
    BLOCK_NAME=$2
    TARGET_FILE=${6:-"$BLOCK_NAME.block"}

    peerChannelFetchBlock "supplychain" "cli.main.foodchain.com" "${BLOCK_NAME}" "peer2.main.foodchain.com:7023" "$TARGET_FILE"

  else

    echo "$@"
    echo "$1, $2, $3, $4, $5, $6, $7, $#"
    printChannelsHelp
  fi

}

printChannelsHelp() {
  echo "Channel management commands:"
  echo ""

  echo "fablo channel list main peer0"
  echo -e "\t List channels on 'peer0' of 'main'".
  echo ""

  echo "fablo channel list main peer1"
  echo -e "\t List channels on 'peer1' of 'main'".
  echo ""

  echo "fablo channel list main peer2"
  echo -e "\t List channels on 'peer2' of 'main'".
  echo ""

  echo "fablo channel getinfo supplychain main peer0"
  echo -e "\t Get channel info on 'peer0' of 'main'".
  echo ""
  echo "fablo channel fetch config supplychain main peer0 [file-name.json]"
  echo -e "\t Download latest config block and save it. Uses first peer 'peer0' of 'main'".
  echo ""
  echo "fablo channel fetch <newest|oldest|block-number> supplychain main peer0 [file name]"
  echo -e "\t Fetch a block with given number and save it. Uses first peer 'peer0' of 'main'".
  echo ""

  echo "fablo channel getinfo supplychain main peer1"
  echo -e "\t Get channel info on 'peer1' of 'main'".
  echo ""
  echo "fablo channel fetch config supplychain main peer1 [file-name.json]"
  echo -e "\t Download latest config block and save it. Uses first peer 'peer1' of 'main'".
  echo ""
  echo "fablo channel fetch <newest|oldest|block-number> supplychain main peer1 [file name]"
  echo -e "\t Fetch a block with given number and save it. Uses first peer 'peer1' of 'main'".
  echo ""

  echo "fablo channel getinfo supplychain main peer2"
  echo -e "\t Get channel info on 'peer2' of 'main'".
  echo ""
  echo "fablo channel fetch config supplychain main peer2 [file-name.json]"
  echo -e "\t Download latest config block and save it. Uses first peer 'peer2' of 'main'".
  echo ""
  echo "fablo channel fetch <newest|oldest|block-number> supplychain main peer2 [file name]"
  echo -e "\t Fetch a block with given number and save it. Uses first peer 'peer2' of 'main'".
  echo ""

}
