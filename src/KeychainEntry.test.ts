import { KeychainEntry } from "@/KeychainEntry";
import { describe, expect, it, vi } from "vitest";

describe("KeychainEntry", () => {
  describe("findGenericPasswordComand", () => {
    it.each([
      [
        "with account, with service",
        {
          keychain: "dummyKeychain",
          account: "dummyAccount",
          service: "dummyService",
        },
        "security find-generic-password -a dummyAccount -s dummyService dummyKeychain",
      ],
      [
        "with account, without service",
        {
          keychain: "dummyKeychain",
          account: "dummyAccount",
          service: "",
        },
        "security find-generic-password -a dummyAccount dummyKeychain",
      ],
      [
        "without account, without service",
        {
          keychain: "dummyKeychain",
          account: "",
          service: "",
        },
        "security find-generic-password dummyKeychain",
      ],
    ])("%s", (name, keychainData, expectedCommand) => {
      expect(new KeychainEntry(keychainData)).toHaveProperty(
        "findGenericPasswordCommand",
        expectedCommand,
      );
    });
  });

  describe("findGenericPasswordOnlyPasswordCommand", () => {
    it("-w switch will be added", () => {
      const keychainEntry = new KeychainEntry({
        keychain: "dummyKeychain",
        account: "",
        service: "",
      });
      vi.spyOn(
        keychainEntry,
        "findGenericPasswordCommand",
        "get",
      ).mockReturnValue("dummyCommand");
      expect(keychainEntry).toHaveProperty(
        "findGenericPasswordOnlyPasswordCommand",
        "dummyCommand -w",
      );
    });
  });
});
