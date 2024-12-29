import type { KeychainData } from "@/KeychainData";
import { execute } from "@/command-execution";
import { VALUE_EXPRESSIONS } from "@/constants";

export class KeychainEntry {
  public service: string;
  public account: string;
  public keychain: string;
  constructor(public keychainData: KeychainData) {
    this.service = keychainData.service;
    this.account = keychainData.account;
    this.keychain = keychainData.keychain;
  }
  protected get findGenericPasswordCommandPrefix() {
    return "security find-generic-password";
  }
  protected get accountParam() {
    return [VALUE_EXPRESSIONS.NULL, ""].includes(this.keychainData.account)
      ? ""
      : `-a "${this.keychainData.account}"`;
  }
  protected get serviceParam() {
    return [VALUE_EXPRESSIONS.NULL, ""].includes(this.keychainData.service)
      ? ""
      : `-s "${this.keychainData.service}"`;
  }
  get findGenericPasswordCommand() {
    return [
      this.findGenericPasswordCommandPrefix,
      this.accountParam,
      this.serviceParam,
      this.keychainData.keychain,
    ]
      .filter((s) => s !== "")
      .join(" ");
  }
  get findGenericPasswordOnlyPasswordCommand() {
    return [
      this.findGenericPasswordCommandPrefix,
      this.accountParam,
      this.serviceParam,
      "-w",
      this.keychainData.keychain,
    ]
      .filter((s) => s !== "")
      .join(" ");
  }
  async getPassword() {
    return await execute(this.findGenericPasswordOnlyPasswordCommand);
  }
}
