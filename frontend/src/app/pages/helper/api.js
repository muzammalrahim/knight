import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
export const headers = {
  'Content-Type': 'application/json',
  // 'Authorization': 'Token 2f2b7961077264b154a140b3111d2063add5f442'
}

export default function list(endpoint, params={}) {
	let config = {
	  headers: headers,
	  params: params,
	}
	console.log(JSON.parse(localStorage.getItem('persist:v705-demo1-auth')).authToken)
	return axios.get(API_URL+endpoint, config).then(response => {
		if(response.data.results !== undefined) {
			response.extra_data = {
				count : response.data.count,
				next : response.data.next,
				previous : response.data.previous,
			}
			response.data = response.data.results;
    }
		return response;
	})
}

// export function patch(endpoint, data) {
//   let config = {
//     headers: headers,
//   }
//   return axios.patch(API_URL + endpoint, data, config)
// }

// export function post(endpoint, data) {
//   let config = {
//     headers: headers,
//   }
//   return axios.post(API_URL + endpoint, data, config)
// }

// export function del(endpoint, data = {}) {
//   let config = {
//     headers: headers,
//     data: data,
//   }
//   return axios.delete(API_URL + endpoint, config)
// }