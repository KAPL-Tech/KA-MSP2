import axios from 'axios';

const api = axios.create({
  // baseURL: 'https://hn4oxxjpn4.execute-api.ap-south-1.amazonaws.com/Stage', 
  baseURL: 'https://4mujdmwmgh.execute-api.ap-south-1.amazonaws.com/Prod',
  headers: {
    authorizationToken: 'asd5464rere', 
  },
});


export default api;