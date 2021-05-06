<template>
    <div class="modal__container">
        <div class="modal__header">
            {{modalTitle}}
            <datetime :min-datetime="getMinExpirationDate()" type="datetime" v-model="expirationDate"></datetime>
        </div>
        <div class="modal__content">
            <div class="modal_box">
                <div class="input-row">
                    <ezInput :class="{'hasError': isValidEmail}" :icon="false" :placeholder='"Enter user`s email"' v-model.trim="$v.userEmail.$model"></ezInput>

                    <button class="btn btn__primary" @click="addUserEmail">Add</button>
                </div>

                <div class="email-list" v-if="emailList.length">
                    <div v-for="(email, index) in emailList" :key="index" class="email-list__item">
                        <span class="name">{{ email }}</span>

                        <svg class="close" xmlns="http://www.w3.org/2000/svg" width="11" height="10" viewBox="0 0 11 10" @click="removeEmail(index)">
                            <g transform="rotate(45 5.5 5)"><path fill="#ffffff" d="M5-2h1v6.5h6.5v1H6V12H5V5.5h-6.5v-1H5z"/></g>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="modal_box" v-if="sharedLink">
                <span class="modal_box__label">Messengers:<br/>(Download the viber/skype app to your computer to share the link via Viber or Skype)</span>
                <div class="social_links space_around__12">
                    <a target="blank" href="https://web.telegram.org/" class="social_item">
                        <img src="@/assets/images/social/telegram.svg" alt="telegram-ico">
                    </a>
                    <a target="blank" href="viber://pa" class="social_item">
                        <img src="@/assets/images/social/viber.svg" alt="viber-ico">
                    </a>
                    <a target="blank" href="https://wa.me/" class="social_item">
                        <img src="@/assets/images/social/hangsout.svg" alt="whatsApp-ico">
                    </a>
                    <a target="blank" href="https://www.facebook.com/" class="social_item">
                        <img src="@/assets/images/social/facebook.svg" alt="facebook-ico">
                    </a>
                    <a target="blank" href="skype:LOGIN?chat" class="social_item">
                        <img src="@/assets/images/social/skype.svg" alt="skype-ico">
                    </a>
<!--                    <a target="blank" href="#" class="social_item">-->
<!--                        <img src="@/assets/images/social/sms.svg" alt="">-->
<!--                    </a>-->
<!--                    <a target="blank" href="mailto:mail@example.com" class="social_item">-->
<!--                        <img src="@/assets/images/social/email.svg" alt="">-->
<!--                    </a>-->
                </div>
            </div>

            <p class="shared_link" v-if="sharedLink">
                <a target="_blank" :href="sharedLink">{{sharedLink}}</a>
            </p>

            <p v-if="linkTerm" class="link-shelf-life">This link will be valid for {{linkTerm}} hours</p>
            <div class="copy_link_button" v-if="!!linkCopied">
                <i class="icon-editor"></i> Link copied to clipboard!
            </div>
        </div>
        <div class="modal__footer">
            <button type="button" class="btn btn__primary" v-if="!!sharedLink" @click="copyToClipboard()">Copy Link</button>
            <div class="space_around__14">
                <button type="button" class="btn btn__bordered" @click="$modal.hide('shareModal')">Close</button>
                <button type="button" class="btn btn__primary" @click="createLinkHandler()">Share</button>
            </div>
        </div>
    </div>
</template>
<script>
import { createLink } from '@/helpers/queries.js'
import {Datetime} from 'vue-datetime';
import {validationMixin} from 'vuelidate';
import {required, email} from 'vuelidate/lib/validators'

export default {
    mixins: [validationMixin],
    data: ()=>({
        modalTitle: 'Share geolocation to',
        scanners: null,
        emailList: [],
        userEmail: "",
        sharedLink: null,
        linkCopied: false,
        expirationDate: ""
    }),
    validations: {
        userEmail: {
            required, email
        }
    },
    props: {
        props: Array
    },
    computed: {
        // setUsersArray(){
        //     return this.usersList ? this.usersList.split(/\s*,\s*/) : []
        // },
        linkTerm() {
            return (this.expirationDate) ? Math.floor((new Date(this.expirationDate) - new Date()) / (1000 * 60 * 60)) : ""
        },
        isValidEmail() {
            return this.$v.userEmail.$dirty && this.$v.userEmail.$error
        },
    },
    components: {
      datetime: Datetime
    },
    created() {
        this.userRole = localStorage.getItem('userRole');
    },
    methods: {
        createLinkHandler(){
            if (this.props) {
                this.scanners = this.props.map(item=>item.value);
                let defaultDate = new Date();
                defaultDate.setDate(defaultDate.getDate() + 1);

                let data = {
                    jsonDate: {
                        users: this.emailList,
                        scanner: this.scanners
                    },
                    expirationDate: (this.expirationDate) ? this.expirationDate : defaultDate
                }
                createLink(this.userRole, data).then(response => {
                    this.sharedLink = `${window.location.origin}/map/${response.data.key}`
                })
            }
        },
        copyToClipboard() {
            const el = document.createElement('textarea');
            el.value = this.sharedLink;
            el.setAttribute('readonly', '');
            el.style.position = 'absolute';
            el.style.left = '-9999px';
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            this.linkCopied = true
        },
        getMinExpirationDate() {
            let minDate = new Date();
            minDate.setHours(new Date().getHours() + 1);

            return minDate.toISOString();
        },
        addUserEmail() {
            this.$v.userEmail.$touch();

            if (this.$v.userEmail.$error) {
                return;
            }

            this.emailList.push(this.userEmail);
            this.userEmail = "";
            this.$v.userEmail.$reset();
        },
        removeEmail(index) {
            this.emailList.splice(index, 1);
        },
    }
}
</script>
<style lang="sass">
.vdatetime-input
    background-color: transparent
    border: none
    border-radius: 4px
    width: 100%
    cursor: pointer
    color: transparent
.email-list
    display: flex
    flex-wrap: wrap
    &:empty
        display: none
    .email-list__item
        margin-right: 12px
        margin-bottom: 10px
        padding: 5px 14px 6px 12px
        border-radius: 20px
        background-color: #3498db
        color: #ffffff
        .name
            margin-right: 16px
            font-size: 12px
        .close
            cursor: pointer
</style>

<style lang="sass" scoped>
    @import '../../assets/style/modules/colors'
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
            padding: 0 32px 15px 32px
            flex-grow: 1
        &__footer
            display: flex
            width: 100%
            justify-content: space-between
            padding: 24px 32px
            border-top: 1px solid $ice-blue
            .btn
                min-width: inherit
                padding: 0 24px
    .modal_box
        &__label
            display: block
            font-size: 14px
            line-height: 1
            margin-top: 24px
            margin-bottom: 12px
    .input-row
        margin-top: 26px
        margin-bottom: 16px
        display: flex
        justify-content: space-between
        .input
            margin-right: 16px
            width: 100%
        .btn
            min-width: 79px

    .vdatetime
        width: 100%
        max-width: 200px
        position: relative
        &:before, &:after
            position: absolute
            pointer-events: none
        &:after
            content: "Link Expiration Date"
            top: 12px
            right: 0
            letter-spacing: 1px
            font-size: 14px
            font-weight: 400
            color: #3498db
        &:before
            content: ""
            top: 8px
            right: 155px
            width: 24px
            height: 24px
            background: url("../../../src/assets/images/ic-plus.svg") no-repeat
            background-size: cover

    .link-shelf-life
        margin-top: 12px
        padding-left: 20px
        letter-spacing: 0.6px
        font-size: 12px
        color: #ed5554
        &:before
            margin-right: 10px
            vertical-align: middle
            content: ""
            display: inline-block
            width: 24px
            height: 24px
            background: url("../../../src/assets/images/icons-alert.svg") no-repeat
            background-size: cover
    .social_links
        display: flex
        margin-bottom: 12px
        .social_item
            display: flex
            align-items: center
            justify-content: center
            padding: 11px
            width: 62px
            height: 62px
            border-radius: 50%
            background-color: $ice-blue
            img
                display: block
                width: 100%
                height: auto
    .copy_link_button
        margin-left: -32px
        margin-right: -32px
        margin-top: 24px
        background-color: rgba($coral, .3)
        display: flex
        align-items: center
        justify-content: center
        font-size: 14px
        color: white
        padding: 14px 0px
        text-align: center
        i
            font-size: 24px
    .shared_link
        margin: 14px 0 0 0
        padding: 20px 24px
        border-radius: 4px
        background-color: #edf1f5
        a
            word-break: break-all
            text-decoration: none
            font-size: 16px
            color: #3498db
            &:hover
                color: lighten(#3498db, 10%)

</style>