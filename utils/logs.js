function log(msg) {
  console.log(`[LOG ${new Date().toISOString()}] ${msg}`);
}

function logError(msg) {
  console.error(`[ERROR ${new Date().toISOString()}] ${msg}`);
}

function logSuccess(msg) {
  console.log(`[SUCCESS ${new Date().toISOString()}] ${msg}`);
}

module.exports = { log, logError, logSuccess };
