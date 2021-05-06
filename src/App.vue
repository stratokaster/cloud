<template>
	<div id="app">
		<router-view></router-view>

        <footerComponent></footerComponent>

        <alertModal ref="alertModal"></alertModal>
	</div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import footerComponent from "@/components/footer/footerComponent";
export default {
	data: ()=>({
		session: null
	}),
    components: {
	    footerComponent
    },
	created() {
		this.session = this.getCookie('session') ? this.getCookie('session') : null;
		this.checkSession();

		window.showAlertModal = (message, redirectPath) => {
            this.$refs.alertModal.showAlertModal(message, redirectPath);
        }
	},
    computed: {
		...mapGetters([
			'isAuthenticated',
		])
	},
	methods:{
		...mapActions([
			'sessionAuthorization'
		]),
		checkSession(){
			if (this.session) {
            // && !this.isAuthenticated
				this.sessionAuthorization(this.session)
                //     .then((data) => {
				// 	this.$router.push({name: 'Dashboard'});
				// })
			}
		},
		getCookie(name) {
			let matches = document.cookie.match(new RegExp(
				"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\7/\+^])/g, '\\$1') + "=([^;]*)"
			));
			return matches ? decodeURIComponent(matches[1]) : undefined;
		}
	}
}
</script>