import { exec } from "node:child_process";

export function execute(cmd: string): Promise<string> {
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
