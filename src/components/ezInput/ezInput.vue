<template>
    <div :class="['input', icon ? 'input__icon_left' : '']">
        <span class="input__icon" v-if="icon"><i class="icon-ic-search"></i></span>
        <input
            :class="['input__item', inputClass]"
            :id="inputId"
            :type="type ? type : 'text'"
            placeholder=" "
            :value="value"
            v-on:input="updateValue($event.target.value)"
            :required="required"
        >
        <span class="input__label">{{placeholder}}</span>
    </div>
</template>
<script>
export default {
    name: 'ezInput',
    data: ()=>({}),
    props: {
        placeholder: String,
        value: String,
        icon: Boolean,
        type: String,
        required: Boolean,
        inputClass: String,
        inputId: String,
    },
    methods: {
        updateValue(value) {
            this.$emit('input', value.toLowerCase());
        }
    }
}
</script>
<style lang="sass" scoped>
@import '@/assets/style/style'
.input
    position: relative
    min-width: 200px
    color: $bluish-grey
    &__icon
        position: absolute
        top: 0
        left: 0
        width: 40px
        height: 40px
        display: inline-flex
        align-items: center
        justify-content: center
        font-size: 20px
        pointer-events: none
    &__label
        position: absolute
        top: 50%
        left: 12px
        font-size: 14px
        transform-origin: 0 0
        transform: translateY(-50%)
        pointer-events: none
        transition: .3s ease
    &__item
        display: block
        width: 100%
        height: 40px
        border-radius: 4px
        border: 1px solid $bluish-grey
        padding-top: 8px
        padding-left: 12px
        &:focus, &:active
            outline: transparent
        &:focus ~ .input__label,
        &:not(:placeholder-shown) ~ .input__label
            transform: translateY(-90%) scale(0.7)
    &__icon_left
        input
            padding-left: 40px
        .input__label
            left: 40px

</style>