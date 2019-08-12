
class AWSHandlers {
  /*
  consistant interface with Amazon Web Services
  */
  constructor (component) {
    // set the nuxt component
    this.component = component
  }

  async awsSignIn (awsGatewayURL, awsHeader, awsBody) {
    // alert('awsGatewayURL: ' + awsGatewayURL)
    // alert('awsHeader: ' + JSON.stringify(awsHeader))
    // alert('awsBody: ' + awsBody)
    // const response = await this.component.$axios.post(awsGatewayURLWithParameters, { headers: awsHeader }, { data: awsBody })
    const response = await this.component.$axios({
      url: awsGatewayURL,
      method: 'post',
      headers: awsHeader,
      data: awsBody })
    // response.status
    // response.statusText
    // response.data.token
    return response
  }
  async awsHello (awsGatewayURL, awsGatewayHeader, awsGatewayBody) {
    // response = await this.component.$axios(awsGatewayURL, { headers: awsGatewayHeader })
    const response = await this.component.$axios({
      url: awsGatewayURL,
      method: 'post',
      headers: awsGatewayHeader,
      data: awsGatewayBody })
    return response
  }
  async awsGET (awsGatewayURLWithParameters, awsHeader) {
    const response = await this.component.$axios(awsGatewayURLWithParameters, { headers: awsHeader })
    return response
  }
}

export { AWSHandlers }
