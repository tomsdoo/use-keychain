import type { KeychainEntry } from "@/KeychainEntry";

declare global {
  var keychainEntries: KeychainEntry[];
}
