export default defineEventHandler(async (event) => {
  // Set SSE headers
  setResponseHeaders(event, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })

  const stream = event.node.res

  // Send history as initial batch
  const history = getMqttLogHistory()
  if (history.length > 0) {
    stream.write(`event: history\ndata: ${JSON.stringify(history)}\n\n`)
  }

  // Subscribe to new entries
  const unsubscribe = subscribeMqttLog((entry) => {
    stream.write(`event: message\ndata: ${JSON.stringify(entry)}\n\n`)
  })

  // Keep connection alive with heartbeat
  const heartbeat = setInterval(() => {
    stream.write(': heartbeat\n\n')
  }, 15000)

  // Clean up on disconnect
  event.node.req.on('close', () => {
    unsubscribe()
    clearInterval(heartbeat)
  })

  // Keep the connection open by returning a promise that never resolves
  await new Promise(() => {})
})
