import axios from 'axios';

const GET = 'get'
const POST = 'post'
const DELETE = 'delete'

export class BaseApiService {
  get(url, options) {
    return this.fetch({ method: GET, url, options })
  }

  post(url, data, options) {
    return this.fetch({ method: POST, url, data, options })
  }

  delete(url, options) {
    return this.fetch({ method: DELETE, url, options })
  }

  fetch({ method, url, data, options }) {
    const requestConfig = {
      url,
      method,
      ...options
    }

    if (data) {
      requestConfig.data = data
    }

    return axios.request(requestConfig)
      .then(res => {
        return res?.data || res
      })
      .catch(err => {
        throw err
      })
  }
}
