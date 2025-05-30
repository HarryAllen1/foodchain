#!/usr/bin/env bash

generateArtifacts() {
  printHeadline "Generating basic configs" "U1F913"

  printItalics "Generating crypto material for main" "U1F512"
  certsGenerate "$FABLO_NETWORK_ROOT/fabric-config" "crypto-config-main.yaml" "peerOrganizations/main.foodchain.com" "$FABLO_NETWORK_ROOT/fabric-config/crypto-config/"

  printItalics "Generating genesis block for group maingroup" "U1F3E0"
  genesisBlockCreate "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config" "MaingroupGenesis"

  # Create directories to avoid permission errors on linux
  mkdir -p "$FABLO_NETWORK_ROOT/fabric-config/chaincode-packages"
  mkdir -p "$FABLO_NETWORK_ROOT/fabric-config/config"
}

startNetwork() {
  printHeadline "Starting network" "U1F680"
  (cd "$FABLO_NETWORK_ROOT"/fabric-docker && docker compose up -d)
  sleep 4
}

generateChannelsArtifacts() {
  printHeadline "Generating config for 'supplychain'" "U1F913"
  createChannelTx "supplychain" "$FABLO_NETWORK_ROOT/fabric-config" "Supplychain" "$FABLO_NETWORK_ROOT/fabric-config/config"
}

installChannels() {
  printHeadline "Creating 'supplychain' on main/peer0" "U1F63B"
  docker exec -i cli.main.foodchain.com bash -c "source scripts/channel_fns.sh; createChannelAndJoin 'supplychain' 'mainMSP' 'peer0.main.foodchain.com:7021' 'crypto/users/Admin@main.foodchain.com/msp' 'orderer0.maingroup.main.foodchain.com:7030';"

  printItalics "Joining 'supplychain' on main/peer1" "U1F638"
  docker exec -i cli.main.foodchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'supplychain' 'mainMSP' 'peer1.main.foodchain.com:7022' 'crypto/users/Admin@main.foodchain.com/msp' 'orderer0.maingroup.main.foodchain.com:7030';"
  printItalics "Joining 'supplychain' on main/peer2" "U1F638"
  docker exec -i cli.main.foodchain.com bash -c "source scripts/channel_fns.sh; fetchChannelAndJoin 'supplychain' 'mainMSP' 'peer2.main.foodchain.com:7023' 'crypto/users/Admin@main.foodchain.com/msp' 'orderer0.maingroup.main.foodchain.com:7030';"
}

installChaincodes() {
  if [ -n "$(ls "$CHAINCODES_BASE_DIR/chaincodes/chaincode-kv-node")" ]; then
    local version="0.0.1"
    printHeadline "Packaging chaincode 'main'" "U1F60E"
    chaincodeBuild "main" "node" "$CHAINCODES_BASE_DIR/chaincodes/chaincode-kv-node" "16"
    chaincodePackage "cli.main.foodchain.com" "peer0.main.foodchain.com:7021" "main" "$version" "node" printHeadline "Installing 'main' for main" "U1F60E"
    chaincodeInstall "cli.main.foodchain.com" "peer0.main.foodchain.com:7021" "main" "$version" ""
    chaincodeInstall "cli.main.foodchain.com" "peer1.main.foodchain.com:7022" "main" "$version" ""
    chaincodeInstall "cli.main.foodchain.com" "peer2.main.foodchain.com:7023" "main" "$version" ""
    chaincodeApprove "cli.main.foodchain.com" "peer0.main.foodchain.com:7021" "supplychain" "main" "$version" "orderer0.maingroup.main.foodchain.com:7030" "" "false" "" ""
    printItalics "Committing chaincode 'main' on channel 'supplychain' as 'main'" "U1F618"
    chaincodeCommit "cli.main.foodchain.com" "peer0.main.foodchain.com:7021" "supplychain" "main" "$version" "orderer0.maingroup.main.foodchain.com:7030" "" "false" "" "peer0.main.foodchain.com:7021" "" ""
  else
    echo "Warning! Skipping chaincode 'main' installation. Chaincode directory is empty."
    echo "Looked in dir: '$CHAINCODES_BASE_DIR/chaincodes/chaincode-kv-node'"
  fi

}

installChaincode() {
  local chaincodeName="$1"
  if [ -z "$chaincodeName" ]; then
    echo "Error: chaincode name is not provided"
    exit 1
  fi

  local version="$2"
  if [ -z "$version" ]; then
    echo "Error: chaincode version is not provided"
    exit 1
  fi

  if [ "$chaincodeName" = "main" ]; then
    if [ -n "$(ls "$CHAINCODES_BASE_DIR/chaincodes/chaincode-kv-node")" ]; then
      printHeadline "Packaging chaincode 'main'" "U1F60E"
      chaincodeBuild "main" "node" "$CHAINCODES_BASE_DIR/chaincodes/chaincode-kv-node" "16"
      chaincodePackage "cli.main.foodchain.com" "peer0.main.foodchain.com:7021" "main" "$version" "node" printHeadline "Installing 'main' for main" "U1F60E"
      chaincodeInstall "cli.main.foodchain.com" "peer0.main.foodchain.com:7021" "main" "$version" ""
      chaincodeInstall "cli.main.foodchain.com" "peer1.main.foodchain.com:7022" "main" "$version" ""
      chaincodeInstall "cli.main.foodchain.com" "peer2.main.foodchain.com:7023" "main" "$version" ""
      chaincodeApprove "cli.main.foodchain.com" "peer0.main.foodchain.com:7021" "supplychain" "main" "$version" "orderer0.maingroup.main.foodchain.com:7030" "" "false" "" ""
      printItalics "Committing chaincode 'main' on channel 'supplychain' as 'main'" "U1F618"
      chaincodeCommit "cli.main.foodchain.com" "peer0.main.foodchain.com:7021" "supplychain" "main" "$version" "orderer0.maingroup.main.foodchain.com:7030" "" "false" "" "peer0.main.foodchain.com:7021" "" ""

    else
      echo "Warning! Skipping chaincode 'main' install. Chaincode directory is empty."
      echo "Looked in dir: '$CHAINCODES_BASE_DIR/chaincodes/chaincode-kv-node'"
    fi
  fi
}

runDevModeChaincode() {
  local chaincodeName=$1
  if [ -z "$chaincodeName" ]; then
    echo "Error: chaincode name is not provided"
    exit 1
  fi

  if [ "$chaincodeName" = "main" ]; then
    local version="0.0.1"
    printHeadline "Approving 'main' for main (dev mode)" "U1F60E"
    chaincodeApprove "cli.main.foodchain.com" "peer0.main.foodchain.com:7021" "supplychain" "main" "0.0.1" "orderer0.maingroup.main.foodchain.com:7030" "" "false" "" ""
    printItalics "Committing chaincode 'main' on channel 'supplychain' as 'main' (dev mode)" "U1F618"
    chaincodeCommit "cli.main.foodchain.com" "peer0.main.foodchain.com:7021" "supplychain" "main" "0.0.1" "orderer0.maingroup.main.foodchain.com:7030" "" "false" "" "peer0.main.foodchain.com:7021" "" ""

  fi
}

upgradeChaincode() {
  local chaincodeName="$1"
  if [ -z "$chaincodeName" ]; then
    echo "Error: chaincode name is not provided"
    exit 1
  fi

  local version="$2"
  if [ -z "$version" ]; then
    echo "Error: chaincode version is not provided"
    exit 1
  fi

  if [ "$chaincodeName" = "main" ]; then
    if [ -n "$(ls "$CHAINCODES_BASE_DIR/chaincodes/chaincode-kv-node")" ]; then
      printHeadline "Packaging chaincode 'main'" "U1F60E"
      chaincodeBuild "main" "node" "$CHAINCODES_BASE_DIR/chaincodes/chaincode-kv-node" "16"
      chaincodePackage "cli.main.foodchain.com" "peer0.main.foodchain.com:7021" "main" "$version" "node" printHeadline "Installing 'main' for main" "U1F60E"
      chaincodeInstall "cli.main.foodchain.com" "peer0.main.foodchain.com:7021" "main" "$version" ""
      chaincodeInstall "cli.main.foodchain.com" "peer1.main.foodchain.com:7022" "main" "$version" ""
      chaincodeInstall "cli.main.foodchain.com" "peer2.main.foodchain.com:7023" "main" "$version" ""
      chaincodeApprove "cli.main.foodchain.com" "peer0.main.foodchain.com:7021" "supplychain" "main" "$version" "orderer0.maingroup.main.foodchain.com:7030" "" "false" "" ""
      printItalics "Committing chaincode 'main' on channel 'supplychain' as 'main'" "U1F618"
      chaincodeCommit "cli.main.foodchain.com" "peer0.main.foodchain.com:7021" "supplychain" "main" "$version" "orderer0.maingroup.main.foodchain.com:7030" "" "false" "" "peer0.main.foodchain.com:7021" "" ""

    else
      echo "Warning! Skipping chaincode 'main' upgrade. Chaincode directory is empty."
      echo "Looked in dir: '$CHAINCODES_BASE_DIR/chaincodes/chaincode-kv-node'"
    fi
  fi
}

notifyOrgsAboutChannels() {

  printHeadline "Creating new channel config blocks" "U1F537"
  createNewChannelUpdateTx "supplychain" "mainMSP" "Supplychain" "$FABLO_NETWORK_ROOT/fabric-config" "$FABLO_NETWORK_ROOT/fabric-config/config"

  printHeadline "Notyfing orgs about channels" "U1F4E2"
  notifyOrgAboutNewChannel "supplychain" "mainMSP" "cli.main.foodchain.com" "peer0.main.foodchain.com" "orderer0.maingroup.main.foodchain.com:7030"

  printHeadline "Deleting new channel config blocks" "U1F52A"
  deleteNewChannelUpdateTx "supplychain" "mainMSP" "cli.main.foodchain.com"

}

printStartSuccessInfo() {
  printHeadline "Done! Enjoy your fresh network" "U1F984"
}

stopNetwork() {
  printHeadline "Stopping network" "U1F68F"
  (cd "$FABLO_NETWORK_ROOT"/fabric-docker && docker compose stop)
  sleep 4
}

networkDown() {
  printHeadline "Destroying network" "U1F916"
  (cd "$FABLO_NETWORK_ROOT"/fabric-docker && docker compose down)

  printf "Removing chaincode containers & images... \U1F5D1 \n"
  for container in $(docker ps -a | grep "dev-peer0.main.foodchain.com-main" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer0.main.foodchain.com-main*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer1.main.foodchain.com-main" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer1.main.foodchain.com-main*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done
  for container in $(docker ps -a | grep "dev-peer2.main.foodchain.com-main" | awk '{print $1}'); do
    echo "Removing container $container..."
    docker rm -f "$container" || echo "docker rm of $container failed. Check if all fabric dockers properly was deleted"
  done
  for image in $(docker images "dev-peer2.main.foodchain.com-main*" -q); do
    echo "Removing image $image..."
    docker rmi "$image" || echo "docker rmi of $image failed. Check if all fabric dockers properly was deleted"
  done

  printf "Removing generated configs... \U1F5D1 \n"
  rm -rf "$FABLO_NETWORK_ROOT/fabric-config/config"
  rm -rf "$FABLO_NETWORK_ROOT/fabric-config/crypto-config"
  rm -rf "$FABLO_NETWORK_ROOT/fabric-config/chaincode-packages"

  printHeadline "Done! Network was purged" "U1F5D1"
}
