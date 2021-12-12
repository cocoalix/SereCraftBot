import "dotenv/config"

import { Message } from "discord.js";
import { ComputeManagementClient } from "@azure/arm-compute"
import { ClientSecretCredential } from "@azure/identity"

import Command from "../commandInterface";

export class AzureBootCommand implements Command {
  commandNames = ["boot", "start"];

  help(commandPrefix: string): string {
    return `Use ${commandPrefix}boot to boot virtual machine on MicrosoftAzure.`;
  }

  async run(message: Message): Promise<void> {
    await message.reply("request received / begin boot VirtualMachine")

    const tenantId = process.env.AZURE_TENANT_ID || "REPLACE-WITH-YOUR-TENANT-ID" 
    const clientId = process.env.AZURE_CLIENT_ID || "REPLACE-WITH-YOUR-CLIENT-ID"
    const secret = process.env.AZURE_CLIENT_SECRET || "REPLACE-WITH-YOUR-CLIENT-SECRET"
    const subscriptionId = process.env.AZURE_SUBSCRIPTION_ID || "REPLACE-WITH-YOUR-SUBSCRIPTION_ID"
    const resGroup = process.env.AZURE_RES_GROUP || "REPLACE-WITH-YOUR-RES_GROUP"
    const vmName = process.env.AZURE_VM_NAME || "REPLACE-WITH-YOUR-VM_NAME"

    const credentials = new ClientSecretCredential(tenantId, clientId, secret)
    const computeClient = new ComputeManagementClient(credentials, subscriptionId)
    const beginStartResponse = await computeClient.virtualMachines.beginStart(resGroup, vmName)

    const response = await beginStartResponse.pollUntilDone();
    console.log(response)

    await message.reply("request accepted / booted VirtualMachine")
  }
}