import axios from "axios";


export const LOGIN_URL = "api/login";
// export const LOGIN_URL = "api/auth/login";
export const REGISTER_URL = "api/auth/register";
export const REQUEST_PASSWORD_URL = "forget_password";
export const NEW_PASSWORD_URL = "api/auth/reset-password/:id";

export const ME_URL = "api/users/me";
// export const ME_URL = "api/me";

export function login(email, password) {
  // return axios.post(LOGIN_URL, { email, password })
  return axios.post(process.env.REACT_APP_API_URL + LOGIN_URL, { email, password })
}

export function register(email, fullname, username, password) {
  return axios.post(REGISTER_URL, { email, fullname, username, password });
}

export function requestPassword(email) {
  console.log("send data",email)
  return axios.post(process.env.REACT_APP_API_URL + REQUEST_PASSWORD_URL, { email });

}

export function newPassword(newpassword) {

  return axios.post(process.env.REACT_APP_API_URL + NEW_PASSWORD_URL, { newpassword });

}


export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getUserByToken() {
  await sleep(2000);

  // Authorization head should be fulfilled in interceptor.
    let Authorization = JSON.parse(localStorage.getItem('persist:v705-demo1-auth')).token;
    return axios.get(process.env.REACT_APP_API_URL + ME_URL).then(response => {
      
      // window.location.assign('/dashboard');
      return (response);
    });



}
