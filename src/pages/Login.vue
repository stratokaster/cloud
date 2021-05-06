<template>
    <div class="login_form">
        <div class="login_form__container">
            <div class="ptb14 plr24 bb bb--silver modal__header">Login please</div>
            <form action="#" @submit.prevent="login">
                <div class="p24">
                    <div class="space_around__14">
                        <ezInput :class="{'flex-full': true, 'hasError': isValidEmail}" placeholder="Email" type="email" v-model.trim="$v.form.email.$model"></ezInput>
                        <p v-if="isValidEmail" class="error-field">This is required field and must be an email</p>

                        <ezInput :class="{'flex-full': true, 'hasError': isValidPassword}" placeholder="Password" type="password" v-model.trim="$v.form.password.$model"></ezInput>
                        <p v-if="isValidPassword" class="error-field">This is required field</p>
                    </div>
                </div>
                <div class="bt bt--silver p24">
                    <div class="space_around__14">
                        <button type="submit" class="btn btn__primary">Login</button>

                        <p class="server-error error-field">{{serverError}}</p>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
import {validationMixin} from 'vuelidate'
import {required, email} from 'vuelidate/lib/validators'
import {mapActions} from 'vuex'

export default {
    mixins: [validationMixin],
    data: () => ({
        form: {
            email: null,
            password: null
        },
        serverError : ''
    }),
    validations: {
        form: {
            email: {
                required, email
            },
            password: {
                required
            }
        }
    },
    methods: {
        ...mapActions([
            'authorization',
        ]),
        login() {
            this.$v.form.$touch();

            if (this.$v.form.$anyError) {
                return;
            }

            let data = {
                email: this.form.email,
                password: this.form.password
            }
            this.authorization(data).then(() => {
                this.$router.push({name: 'Dashboard'});
            }, (error) => {
                this.serverError = error.name + ': ' + error.message;

                setTimeout(() => this.serverError = '', 5000);
            })
        },
    },
    computed: {
        isValidEmail() {
            return this.$v.form.email.$dirty && this.$v.form.email.$error
        },
        isValidPassword() {
            return this.$v.form.password.$dirty && this.$v.form.password.$error
        }
    }
}
</script>
<style lang="sass" scoped>
.error-field
    margin-top: 0
    width: 100%
    font-size: 14px
    color: #e04b4b
.server-error
    margin-top: 7px
    text-align: center
    &:empty
        margin: 0
.login_form
    display: flex
    align-items: center
    justify-content: center
    height: 100vh

    &__container
        max-width: 450px
        background-color: white
        border-radius: 4px
        box-shadow: 0px 5px 25px rgba(#000, .3)

    .btn__primary
        flex-grow: 1
</style>