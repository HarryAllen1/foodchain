import { Contract, Context } from "fabric-contract-api";
import { Shipment } from "./AssetInterface";
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

  async createShipment(ctx: Context, uniqueID: string) {
    const shipment: Shipment = {
      uniqueID,
      packageID: nanoid(6),
      owner: await this.getCertificate(ctx),
      history: [],
    };

    await ctx.stub.putState(uniqueID, Buffer.from(JSON.stringify(shipment)));

    return shipment.uniqueID+shipment.packageID;
  }

  async getShipment(ctx: Context, shipmentID: string) {
    let shipment;

    try {
      shipment = await ctx.stub.getState(shipmentID);
    } catch (error) {
      return "NOT_FOUND";
    }
    
    if (!shipment || shipment.length === 0) {
      return "NOT_FOUND" ;
    }

    shipment = JSON.parse(shipment.toString());
    return shipment  ;
  }

  async transferShipment(ctx: Context, shipmentID: string, newOwner: string) {
    let shipment;

    try {
      shipment = await ctx.stub.getState(shipmentID);
    } catch (error) {
      return "NOT_FOUND";
    } 
    const shipmentData: Shipment = JSON.parse(shipment.toString());

    if (shipmentData.owner !== await this.getCertificate(ctx)) {
      return"NOT_ALLOWED";
    }

    if (!newOwner.startsWith("x509::/")) {
      return "INVALID_OWNER";
    }

    shipmentData.history.push(shipmentData.owner);
    shipmentData.owner = newOwner;

    await ctx.stub.putState(shipmentID, Buffer.from(JSON.stringify(shipmentData)));
  }
}

export const contracts = [KVContract]
