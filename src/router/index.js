import Vue from 'vue'
import store from "@/store";
import VueRouter from 'vue-router'
import Dashboard from '@/pages/Dashboard'
import ClientView from "@/pages/ClientView";
import Login from '@/pages/Login'
import SuperAdmin from "@/pages/SuperAdmin";

Vue.use(VueRouter)

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next();
    return;
  }
  next("/");
};

const ifAuthenticated = (to, from, next) => {
	if (store.getters.isAuthenticated) {
		(localStorage.getItem('userRole') === "SuperAdmin" && to.path !== "/superAdmin") ? next("/superAdmin") : next();
		return;
	}
	next("/login");
};

const routes = [
	{
		path: '/',
		name: 'Dashboard',
		component: Dashboard,
		beforeEnter: ifAuthenticated
	},
	{
		path: '/superAdmin',
		name: 'superAdmin',
		component: SuperAdmin,
		beforeEnter: ifAuthenticated
	},
	{
		path: '/map/:hash',
		name: 'clientView',
		component: ClientView,
		props: true
	},
	{
		path: "/login",
		name: "login",
		component: Login,
		beforeEnter: ifNotAuthenticated
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
