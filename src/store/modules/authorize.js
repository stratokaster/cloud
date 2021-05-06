import { GettokenByAuthForm, GetTokenBySession } from '@/helpers/queries.js'
export default {
    state: {
        token: localStorage.getItem('token') || '',
        status: '',
    },
    getters: {
        isAuthenticated: state => !!state.token && state.status === 'success'
    },
    mutations: {
        AUTH_REQUEST: state => state.status = 'loading',
        AUTH_SUCCESS: (state, responce)=>{
            state.status = 'success';
            state.token = responce.data.token;
        },
        AUTH_ERROR: state => {
            state.status = 'error';
            state.token = "";
        },
    },
    actions: {
        authorization: ({ commit }, data) => {
            return new Promise((resolve, reject)=>{
                commit('AUTH_REQUEST');
                GettokenByAuthForm(data).then(responce=>{
                    if(responce.status === 200){
                        localStorage.setItem('token', responce.data.token);
                        localStorage.setItem('userRole', responce.data.role);
                        commit('AUTH_SUCCESS', responce);
                    }
                    resolve(responce);
                })
                .catch(e=>{
                    commit('AUTH_ERROR', e);
                    localStorage.removeItem('token');
                    localStorage.removeItem('userRole');
                    reject(e);
                })
            })
        },
        sessionAuthorization: ({commit, dispatch}, session) => {
            return new Promise((resolve, reject)=>{
                commit('AUTH_REQUEST');
                GetTokenBySession(session).then(responce=>{
                    if(responce.status == 200){
                        localStorage.setItem('token', responce.data.token);
                        localStorage.setItem('userRole', responce.data.role);
                        commit('AUTH_SUCCESS', responce);
                    }
                    resolve(responce);
                }).catch(e=>{
                    commit('AUTH_ERROR', e);
                    localStorage.removeItem('token');
                    localStorage.removeItem('userRole');
                    reject(e);
                })
            })
        }
    }
}