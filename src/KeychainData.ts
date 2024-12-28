export interface KeychainData {
  keychain: string;
  account: string;
  service: string;
}

export function parseKeychainDump(result: string) {
  const lines = result.split(/\n/);
  const keychainEntries: KeychainData[] = [];
  let keychain = "";
  let account = "";
  let service = "";
  lines.forEach((line) => {
    const parsedKeychain = tryParseKeychain(line);
    if (parsedKeychain != null) {
      if (keychain !== "") {
        keychainEntries.push({
          keychain,
          account,
          service,
        });
        account = "";
        service = "";
      }
      keychain = parsedKeychain;
      return;
    }

    const parsedAccount = tryParseAccount(line);
    if (parsedAccount != null) {
      account = parsedAccount;
      return;
    }

    const parsedService = tryParseService(line);
    if (parsedService != null) {
      service = parsedService;
      return;
    }
  });

  keychainEntries.push({
    keychain,
    account,
    service,
  });

  return keychainEntries;
}


function tryParseKeychain(line: string) {
  const isKeychainLine = /^keychain:/.test(line);
  if (!isKeychainLine) {
    return null;
  }
  return line.replace(/^keychain:\s+/, "").replace(/"/g, "");
}

function tryParseAccount(line: string) {
  const isAccount = /^\s+"acct".+/.test(line);
  if (!isAccount) {
    return null;
  }
  return line
    .replace(/^(\s+"acct".+=)(.+)(\s*)$/, ($0,$1,$2) => $2)
    .replace(/^"/, "")
    .replace(/"$/, "");
}

function tryParseService(line: string) {
  const isService = /^\s+"svce".+/.test(line);
  if (!isService) {
    return null;
  }
  return line
    .replace(/^(\s+"svce".+=)(.+)(\s*)$/, ($0,$1,$2) => $2)
    .replace(/^"/, "")
    .replace(/"$/, "");
}
