exports.error = (...message) => {
  console.error('[x]', ...message)
  process.exit(1)
}
