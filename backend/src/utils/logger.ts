export function logInfo(message: string) {
  console.log(
    `[INFO] ${new Date().toLocaleTimeString()} | ${message}`
  );
}

export function logSuccess(message: string) {
  console.log(
    `[SUCCESS] ${new Date().toLocaleTimeString()} | ${message}`
  );
}

export function logError(message: string) {
  console.error(
    `[ERROR] ${new Date().toLocaleTimeString()} | ${message}`
  );
}