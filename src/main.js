import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import {Datetime} from "vue-datetime";

import '@/assets/fontello/fontello.css'
import VModal from 'vue-js-modal/dist/index.nocss.js'
import '@/assets/font/css/fontello.css'
import 'vue-js-modal/dist/styles.css'
import 'vue-datetime/dist/vue-datetime.css'

function getCookie(name) {
	let matches = document.cookie.match(new RegExp(
		"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\7/\+^])/g, '\\$1') + "=([^;]*)"
	));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

// Global costom components
import ezSelect from '@/components/ezSelect/ezSelect';
import ezBtnsSwitch from '@/components/ezBtnsSwitch/ezBtnsSwitch';
import ezInput from '@/components/ezInput/ezInput';
import preloader from "@/components/preloader/preloader";
import alertModal from "@/components/modals/alertModal/alertModal";

Vue.component('ezSelect', ezSelect);
Vue.component('ezBtnsSwitch', ezBtnsSwitch);
Vue.component('ezInput', ezInput);
Vue.component('preloader', preloader);
Vue.component('alertModal', alertModal);

Vue.use(VModal, {dialog: true, dynamic: true, injectModalsContainer: true});
Vue.use(Datetime);

let dotenv = require('dotenv');
let dotenvExpand = require('dotenv-expand');

const URL = process.env.VUE_APP_URL;
const session = getCookie('session');
let myEnv = dotenv.config();
dotenvExpand(myEnv);

Vue.prototype.$http = axios.create({
	baseURL: URL,
	headers: {
		session: session
	}
});

Vue.config.productionTip = false;
new Vue({
	store,
	router,
	render: h => h(App)
}).$mount('#app')
