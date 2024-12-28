#!/usr/bin/env node
import { Command } from "commander";
import { exec } from "child_process";
import { parseKeychainDump } from "@/KeychainData";
import { start as startRepl } from "node:repl";
import { KeychainEntry } from "@/KeychainEntry";

function execute(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err == null) {
        resolve(stdout);
      } else {
        reject(stderr);
      }
    });
  });
}

const program = new Command();

program
  .name("use-keychain")
  .description("keychain utility")
  .version("0.1.0");

program.command("list-entries")
  .description("list entries")
  .option("--format <format>", "json | table", "json")
  .action(async (options: { format: string }) => {
    const result = await execute(`security dump-keychain`).catch(e => null);
    if (result == null) {
      return;
    }
    const entries = parseKeychainDump(result);
    switch(options.format) {
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

program.command("list-services")
  .description("list services")
  .action(async () => {
    const result = await execute(`security dump-keychain`).catch(e => null);
    if (result == null) {
      return;
    }
    const entries = parseKeychainDump(result);
    Array.from(new Set(
      entries
        .map(({ service }) => service)
    ))
      .filter(service => service !== "<NULL>" && service !== "")
      .forEach(service => {
        console.log(service);
      });
  });

program.command("list-accounts")
  .description("list accounts")
  .action(async () => {
    const result = await execute(`security dump-keychain`).catch(e => null);
    if (result == null) {
      return;
    }
    const entries = parseKeychainDump(result);
    Array.from(new Set(
      entries
        .map(({ account }) => account)
    ))
      .filter(account => account !== "<NULL>" && account !== "")
      .forEach(account => {
        console.log(account);
      });
  });

program.command("repl")
  .description("go into repl")
  .action(async () => {
    const result = await execute(`security dump-keychain`).catch(e => null);
    if (result == null) {
      return;
    }
    globalThis.keychainEntries = parseKeychainDump(result).map(data => new KeychainEntry(data));
    startRepl();
  });

program.parse();