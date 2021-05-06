<template>
    <div>
        <modal name="promptModal" :maxWidth="619" height="auto" :adaptive="true" :clickToClose="false">
            <div class="modal__container">
                <div class="modal__header">
                    Please enter your email indicated in the EzCloud link
                </div>

                <div class="modal__content">
                    <ezInput :class="{'hasError': isValidEmail}" :icon="false" :placeholder='"Enter Your email"' v-model.trim="$v.userEmail.$model"></ezInput>
                </div>

                <div class="modal__footer">
                    <button type="button" class="btn btn__bordered" @click="$modal.hide('promptModal'); $router.push('/login')">Close</button>
                    <button type="button" class="btn btn__primary" :disabled="userEmail && isValidEmail" @click="emitEmail">Apply</button>
                </div>
            </div>
        </modal>
    </div>
</template>

<style lang="sass" scoped>
@import '../../../assets/style/modules/colors'
.modal
    &__container
        height: 100%
        display: flex
        flex-direction: column
        font-family: "Roboto", sans-serif
        color: $dark-grey-blue
    &__header
        padding: 30px 32px 29px 32px
        display: flex
        justify-content: space-between
        align-items: center
        font-size: 24px
        font-weight: 500
        background-color: $ice-blue
    &__content
        padding: 32px
        flex-grow: 1
    &__footer
        display: flex
        width: 100%
        justify-content: flex-end
        padding: 24px 32px
        border-top: 1px solid $ice-blue
        .btn
            min-width: inherit
            padding: 0 24px
        .btn + .btn
            margin-left: 14px
</style>

<script>
import {validationMixin} from 'vuelidate';
import {required, email} from 'vuelidate/lib/validators';

export default {
    mixins: [validationMixin],
    name: 'promptModal',
    data() {
        return {
            userEmail: ""
        }
    },
    validations: {
        userEmail: {
            required, email
        }
    },
    methods: {
        showPromptModal() {
            this.$modal.show("promptModal");
        },
        hidePromptModal() {
            this.$modal.hide("promptModal");
        },
        emitEmail() {
            this.$emit('userEmail', this.userEmail);
        }
    },
    computed: {
        isValidEmail() {
            return this.$v.userEmail.$dirty && this.$v.userEmail.$error
        }
    }
}
</script>