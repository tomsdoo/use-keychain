import { parseKeychainDump } from "@/KeychainData";
import text from "@@/fixtures/dump-keychain-text.log?raw";
import { describe, expect, it } from "vitest";

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
