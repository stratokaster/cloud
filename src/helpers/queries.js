import axios  from 'axios';

const URL = process.env.VUE_APP_URL;
const session = process.env.VUE_APP_SESSION;

const $http = axios.create({
    baseURL: URL,
});

$http.interceptors.request.use(
    function (config) {
        if(localStorage.getItem("token")) {
            config.headers.Authorization = 'b ' + localStorage.getItem("token");
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);


// GET Queries
export const GetAllScannerByUserId = (userRole) => {
    return $http.get(`/${userRole}/getAllScannerByUserId`).then(responce => responce.data).catch(e => e);
}
export const getLinkStatus = (hash) => {
    return $http.get(`GlobalController/getStatusOfLink/${hash}`);
}
export const getScannersInfo = (hash, userRole) => {
    return (userRole) ? $http.get(`${userRole}/getScannersByLink/${hash}`) : $http.get(`GlobalController/getScannersByLink/${hash}`)
}

export const getSuperAdminScanners = () => {
    return $http.get(`SuperAdmin/getAllScanners/`);
}

// POST Queries
export const GettokenByAuthForm = (data) => {
    return $http.post(`user/SignIn`, data);
};
export const GetTokenBySession = (session) => {
    return $http.post(`user/SignIn/${session}`);
};
export const getlastLocationWithInfo = (userRole, data) => {
    return (userRole === "Client") ? $http.get(`${userRole}/getLastLocationWithInfo`) : $http.post(`${userRole}/getLastLocationWithInfo`, data)
};
export const createLink = (userRole, data) => {
    return $http.post(`${userRole}/createLink`, data)
};
export const getInfoForShareLink = (data, userRole) => {
    return (userRole) ? $http.post(`${userRole}/getInfoForShareLink`, data) : $http.post(`GlobalController/getInfoForShareLink`, data);
};

export const checkEzlogzMail = (data) => {
    return $http.post(`/GlobalController/checkEzlogzMail`, data);
};