<template>
    <div class="btn_switcher">
        <button type="button" :class="[checked.btnText === btn.btnText ? 'active' : '']" v-for="(btn, index) in btns" :key="index" :data-value="btn.btnValue" @click="changeActiveBtn(btn)">{{btn.btnText}}</button>
    </div>
</template>
<script>
export default {
    name: 'ezBtnsSwitch',
    props: {
        btns: Array,
        activeBtn: Object
    },
    model: {
        prop: 'activeBtn',
        event: 'click'
    },
    data: () => ({
        checked: null,
    }),
    created() {
        if(this.activeBtn){
            this.checked = this.activeBtn;
            this.changeActiveBtn(this.checked);
        }
    },
    methods: {
        changeActiveBtn(btn){
            this.checked = btn;
            this.$emit('click', this.checked);
        }
    }
}
</script>
<style scoped lang="sass">
@import '@/assets/style/style'
.btn_switcher
    display: flex
    border: 1px solid $bluish-grey
    border-radius: 4px
    height: 40px
    button
        display: flex
        align-items: center
        justify-content: center
        min-width: 110px
        height: 40px
        border: none
        background-color: transparent
        cursor: pointer
        margin-top: -1px
        margin-bottom: -1px
        transition: .3s ease
        & + button
            border-left: 1px solid $bluish-grey
        &.active
            background-color: $primary
            border-color: $primary
            color: white
        &:active, &:focus
            outline: transparent
        &:first-child
            margin-left: -1px
            border-radius: 4px 0px 0px 4px
        &:last-child
            margin-right: -1px
            border-radius: 0px 4px 4px 0px
</style>