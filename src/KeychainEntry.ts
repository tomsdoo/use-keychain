import type { KeychainData } from "@/KeychainData";

export class KeychainEntry {
  constructor(public keychainData: KeychainData) {}
  get findGenericPasswordCommand() {
    const accountParams = ["<NULL>", ""].includes(this.keychainData.account)
      ? ""
      : `-a ${this.keychainData.account}`;
    const serviceParams = ["<NULL>", ""].includes(this.keychainData.service)
      ? ""
      : `-s ${this.keychainData.service}`;
    return [
      "security",
      "find-generic-password",
      accountParams,
      serviceParams,
      this.keychainData.keychain,
    ]
      .filter(s => s !== "")
      .join(" ");
  }
  get findGenericPasswordOnlyPasswordCommand() {
    return `${this.findGenericPasswordCommand} -w`;
  }
}
