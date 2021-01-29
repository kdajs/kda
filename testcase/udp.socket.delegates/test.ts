export const Test1: UDPSocketDelegate = (state, params, callbackComplete, callbackError): void => {
  // state.config.path
  console.log('UDPSocketDelegate[Test1]', params)

  // setTimeout(() => {
  //   callbackComplete('结果')
  // }, 2000)
}
