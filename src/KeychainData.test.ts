import { describe, it, expect } from "vitest";
import text from "@@/fixtures/dump-keychain-text.log?raw";
import { parseKeychainDump } from "@/KeychainData";

describe("parseKeychainDump()", () => {
  it("will parse correctly", () => {
    expect(parseKeychainDump(text)).toEqual([
      {
        keychain: "dummy-keychain-path",
        account: "dummyAccount",
        service: "dummyService with account",
      },
      {
        keychain: "dummy-keychain-path",
        account: "<NULL>",
        service: "dummyService without account",
      },
      {
        keychain: "dummy-keychain-path",
        account: "<NULL>",
        service: "<NULL>",
      },
      {
        keychain: "dummy-keychain-path",
        account: "dummyAccountInet",
        service: "",
      },
    ]);
  });
});
