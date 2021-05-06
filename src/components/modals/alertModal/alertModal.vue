<template>
    <div>
        <modal name="alertModal" :maxWidth="619" height="auto" :adaptive="true" :clickToClose="false">
            <div class="modal__container">
                <div class="modal__content">
                    <p class="alert-message">{{alertMessage}}</p>
                </div>

                <div class="modal__footer">
                    <button type="button" class="btn btn__primary" @click="confirmAlert">Ok</button>
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

<style lang="sass">
    .alert-message
        margin: 20px 0
        text-align: center
        font-size: 24px
        font-weight: 500
</style>

<script>

export default {
    name: 'alertModal',
    data() {
        return {
            alertMessage: "",
            redirectPath: ""
        }
    },
    methods: {
        showAlertModal(message, redirectPath) {
            this.alertMessage = message;
            redirectPath ? this.redirectPath = redirectPath : "";
            this.$modal.show("alertModal");
        },
        confirmAlert() {
            this.$modal.hide('alertModal');
            if (this.redirectPath) {
                this.$router.push(this.redirectPath);
            }
        }
    }
}
</script>