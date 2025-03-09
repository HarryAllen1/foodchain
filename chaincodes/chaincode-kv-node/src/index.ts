import { Contract, Context } from "fabric-contract-api";
import * as crypto from "node:crypto";

class KVContract extends Contract {
  constructor() {
    super("KVContract");
  }

  async instantiate() {
    console.log("Main instantiated");
  }

  async put(ctx: Context, id: string, value: WithImplicitCoercion<ArrayBufferLike>) {
    await ctx.stub.putState(id, Buffer.from(value));
    return { success: "OK" };
  }

  async get(ctx: Context, key: string) {
    const buffer = await ctx.stub.getState(key);
    if (!buffer || !buffer.length) return { error: "NOT_FOUND" };
    return { success: buffer.toString() };
  }

  async hasId(ctx: Context, key: string) {
    const buffer = await ctx.stub.getState(key);
    if (!buffer || !buffer.length) return { error: "NOT_FOUND" };
    return { success: "OK" };
  }

  async putPrivateMessage(ctx: Context, collection: string) {
    const transient = ctx.stub.getTransient();
    const message = transient.get("message");
    await ctx.stub.putPrivateData(collection, "message", message);
    return { success: "OK" };
  }

  async getPrivateMessage(ctx: Context, collection: string) {
    const message = await ctx.stub.getPrivateData(collection, "message");
    const messageString = message.toBuffer ? message.toBuffer().toString() : message.toString();
    return { success: messageString };
  }

  async verifyPrivateMessage(ctx: Context, collection: string) {
    const transient = ctx.stub.getTransient();
    const message = transient.get("message");
    const messageString = message.toBuffer ? message.toBuffer().toString() : message.toString();
    const currentHash = crypto.createHash("sha256").update(messageString).digest("hex");
    const privateDataHash = (await ctx.stub.getPrivateDataHash(collection, "message")).toString("hex");
    if (privateDataHash !== currentHash) {
      return { error: "VERIFICATION_FAILED" };
    }
    return { success: "OK" };
  }
}

export const contracts = [KVContract]
