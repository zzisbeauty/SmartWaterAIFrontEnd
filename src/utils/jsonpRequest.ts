import axios from 'axios'
import jsonp from 'axios-jsonp'

const jsonpRequest = async (url) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        adapter: jsonp
      })
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export { jsonpRequest }
