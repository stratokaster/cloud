<template>
    <footer class="footer">
        <div class="copy">© EzLogz 2020</div>
<!--        <div class="footer__nav">-->
<!--            <ul>-->
<!--                <li><a href="#">Dashboard</a></li>-->
<!--                <li><a href="#">Terms & Conditions</a></li>-->
<!--                <li><a href="#">Privacy</a></li>-->
<!--                <li><a href="#">Support Ticket</a></li>-->
<!--                <li><a href="#">Video Tutorial</a></li>-->
<!--            </ul>-->
<!--        </div>-->
    </footer>
</template>

<style lang="sass">
.footer
    display: flex
    justify-content: flex-end
    padding-top: 16px
    font-size: 12px
    &__nav
        ul
            display: flex
            li
                margin-left: 24px
</style>

<script>
export default {
    name: 'footerComponent',
    data() {
        return {}
    }
}
</script>

