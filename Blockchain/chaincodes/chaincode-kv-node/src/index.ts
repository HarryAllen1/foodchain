import { Contract, Context } from "fabric-contract-api";
import { Asset } from "./AssetInterface";
const { nanoid } = require("nanoid");
class KVContract extends Contract {
  constructor() {
    super("KVContract");
  }

  async instantiate() {
    console.log("Main instantiated");
  }

  async getCertificate(ctx: Context) {
    return await ctx.clientIdentity.getID();
  }

  async createShipment(ctx: Context, uuId: string) {
    const shipment: Asset = {
      uuId,
      uuSId: nanoid(6),
      owner: await ctx.clientIdentity.getID(),
      pastOwners: [],
      parentShipments: [],
    };
    
    await ctx.stub.putState(shipment.uuId + shipment.uuSId, Buffer.from(JSON.stringify(shipment)));

    return shipment.uuId + shipment.uuSId;
  }

  async getShipment(ctx: Context, totalShimpentId: string) {
    const shipment = await ctx.stub.getState(totalShimpentId);
    if (!shipment || shipment.length === 0) {
      throw new Error(`Shipment ${totalShimpentId} does not exist`);
    }
    return shipment.toString();
  }

  async transferShipment(ctx: Context, totalShimpentId: string, newOwner: string) {
    let shipment;

    try {
      shipment = await ctx.stub.getState(totalShimpentId);
    } catch (error) {
      return "NOT_FOUND";
    } 
    const shipmentData: Asset = JSON.parse(shipment.toString());

    if (shipmentData.owner !== await this.getCertificate(ctx)) {
      return "NOT_ALLOWED";
    }

    if (!newOwner.startsWith("x509::/")) {
      return "INVALID_OWNER";
    }
    
    shipmentData.pastOwners.push(shipmentData.owner);
    shipmentData.owner = newOwner;

    await ctx.stub.putState(totalShimpentId, Buffer.from(JSON.stringify(shipmentData)));
    return {'response':'ok'}
  }

  async transformShipment(ctx: Context, uuId: string, parentShipmentIdsStr: string) {
    const parentShipmentIds: string[] = JSON.parse(parentShipmentIdsStr);
    const parentShipments: string[] = [];

    for (const parentShipmentId of parentShipmentIds) {
      let parentShipment: Asset;
      try {
        const shipment = await ctx.stub.getState(parentShipmentId);

        if (!shipment || shipment.length === 0) {
          throw new Error(`Shipment ${parentShipmentId} does not exist`);
        }

        const parentShipment: Asset = JSON.parse(shipment.toString());
        
        if (parentShipment.owner !== await this.getCertificate(ctx)) {
          throw new Error(`Shipment: ${parentShipmentId} is not owned by you`);
        }

        parentShipments.push(parentShipmentId);
      }
      catch (error) {
        throw new Error(error);
      }
    }

    const newshipment: Asset = {
      uuId,
      uuSId: nanoid(6),
      owner: await ctx.clientIdentity.getID(),
      pastOwners: [],
      parentShipments,
    };

    await ctx.stub.putState(newshipment.uuId + newshipment.uuSId, Buffer.from(JSON.stringify(newshipment)));
    return newshipment.uuId + newshipment.uuSId;
  }

  async getPath(ctx: Context, totalShimpentId: string) {
    const shipment = await ctx.stub.getState(totalShimpentId);
    const prevOwnerNodes: string[] = [];
    const edges: { from: string; to: string }[] = [];

    if (!shipment || shipment.length === 0) {
      throw new Error(`Shipment ${totalShimpentId} does not exist`);
    }

    const shipmentData: Asset = JSON.parse(shipment.toString());
    
    return await this.DagCreateRecursion(ctx, shipmentData, prevOwnerNodes, edges);
  }

  private async DagCreateRecursion(ctx: Context, shipmentData: Asset, prevOwnerNodes: string[] = [], edges: { from: string; to: string }[]) {

    if (shipmentData.pastOwners.length > 0) {
      console.log(KVContract.GetNameFromCertificate(shipmentData.pastOwners[shipmentData.pastOwners.length-1]));
      prevOwnerNodes.push(KVContract.GetNameFromCertificate(shipmentData.pastOwners[shipmentData.pastOwners.length-1]));
      edges.push({ from: KVContract.GetNameFromCertificate(shipmentData.pastOwners[shipmentData.pastOwners.length-1]), to: KVContract.GetNameFromCertificate(shipmentData.owner)});
    }

    for (let i = shipmentData.pastOwners.length-2; i >= 0; i--) {
      prevOwnerNodes.push(KVContract.GetNameFromCertificate(shipmentData.pastOwners[i]));
      edges.push({ from : KVContract.GetNameFromCertificate(shipmentData.pastOwners[i]), to: KVContract.GetNameFromCertificate(shipmentData.pastOwners[i+1])});
    }

    for (const parentShipmentId of shipmentData.parentShipments) {
      let parentShipment: Asset;
      try {
        const shipment = await ctx.stub.getState(parentShipmentId);

        if (!shipment || shipment.length === 0) {
          throw new Error(`Shipment ${parentShipmentId} does not exist`);
        }

        parentShipment = JSON.parse(shipment.toString());

      } catch (error) {
        throw new Error(error);
      }
      prevOwnerNodes.push(KVContract.GetNameFromCertificate(parentShipment.owner));
      edges.push({ from: KVContract.GetNameFromCertificate(parentShipment.owner), to: KVContract.GetNameFromCertificate(shipmentData.pastOwners[0])});

      const parentDAG =  await this.DagCreateRecursion(ctx, parentShipment, prevOwnerNodes, edges);
      prevOwnerNodes.push(...parentDAG.nodes);
      edges.push(...parentDAG.edges);
    }

    return { nodes: prevOwnerNodes, edges };
  }

  private static GetNameFromCertificate(Certificate: string){
      const index = Certificate.indexOf("/CN=")
      const name = Certificate.substring(index+4, Certificate.indexOf(":",index))
      return name
  }
}

export const contracts = [KVContract]
