import Vue from 'vue';
import Vuex from 'vuex';
import authorize from './modules/authorize'

import { getlastLocationWithInfo } from '@/helpers/queries.js'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		allScaners: null
	},
	getters: {
		isScanerAdd: state => !!state.allScaners,
		getScaners: state => state.allScaners,
	},
	actions:{
		GetLastLocations: ({commit}, data) => {
			return new Promise((resolve, reject)=>{
				getlastLocationWithInfo(localStorage.getItem('userRole'), data).then(responce => {
					if(responce.status === 200){
						commit('ADD_ALL_SCANNERS', responce.data);
						resolve(responce);
					}
				}).catch(e=>{
					commit('AUTH_ERROR', e);
					localStorage.removeItem('token');
					localStorage.removeItem('userRole');
					reject(e);
					window.showAlertModal("Authorization error", "/login");
				});
			})
		}
	},
	mutations:{
		ADD_ALL_SCANNERS: (state, data)=>{
			state.allScaners = data
		}
	},
	modules: {
		authorize
	}
})
