#!/usr/bin/env node
import { start as startRepl } from "node:repl";
import { inspect as utilInspect } from "node:util";
import { parseKeychainDump } from "@/KeychainData";
import { KeychainEntry } from "@/KeychainEntry";
import { execute } from "@/command-execution";
import { VALUE_EXPRESSIONS } from "@/constants";
import { version } from "@@/package.json";
import { Command } from "commander";

async function dumpKeychain() {
  const result = await execute("security dump-keychain").catch(() => null);
  if (result == null) {
    return [];
  }
  return parseKeychainDump(result);
}

const program = new Command();

program.name("use-keychain").description("keychain utility").version(version);

program
  .command("list-entries")
  .description("list entries")
  .option("--format <format>", "json | table", "json")
  .action(async (options: { format: string }) => {
    const entries = await dumpKeychain();
    switch (options.format) {
      case "table": {
        console.table(entries);
        break;
      }
      default: {
        console.log(JSON.stringify(entries, null, 2));
        break;
      }
    }
  });

program
  .command("list-services")
  .description("list services")
  .action(async () => {
    const entries = await dumpKeychain();
    const uniqueServices = Array.from(
      new Set(entries.map(({ service }) => service)),
    ).filter((service) => service !== VALUE_EXPRESSIONS.NULL && service !== "");
    for (const service of uniqueServices) {
      console.log(service);
    }
  });

program
  .command("list-accounts")
  .description("list accounts")
  .action(async () => {
    const entries = await dumpKeychain();
    const uniqueAccounts = Array.from(
      new Set(entries.map(({ account }) => account)),
    ).filter((account) => account !== VALUE_EXPRESSIONS.NULL && account !== "");
    for (const account of uniqueAccounts) {
      console.log(account);
    }
  });

program
  .command("repl")
  .description("go into repl")
  .action(async () => {
    const entries = await dumpKeychain();
    globalThis.keychainEntries = entries.map((data) => new KeychainEntry(data));

    const options = Intl.DateTimeFormat().resolvedOptions();
    const formatter = new Intl.DateTimeFormat(options.locale, {
      dateStyle: "medium",
      timeStyle: "medium",
      timeZone: options.timeZone,
    });
    function makePrompt() {
      return `use-keychain ${formatter.format(new Date())} > `;
    }
    const server = startRepl({
      prompt: makePrompt(),
      writer(obj: unknown) {
        server.setPrompt(makePrompt());
        return utilInspect(obj);
      },
    });
  });

program.parse();
