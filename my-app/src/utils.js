import axios from 'axios';

export const axiosRequest = async(body, flag) => {
    axios(body)
    .then((response) => {
        console.log(response);
        if (flag) {
            //console.log(response.data);
            return JSON.stringfy(response.data);
        };
    })
    .catch((error) => {
        console.log(error)
    })
}
    
//export default axiosRequest;
