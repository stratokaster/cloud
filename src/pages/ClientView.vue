<template>
    <div class="client-view">
        <div class="page__content">
            <header class="header">
                <div class="header__top">
                    <div class="back">
                        Go to
                        <a href="https://ezlogz.com/" class="back_btn">
                            ezlogz.com
                        </a>
                    </div>
                    <div class="logo"><img src="@/assets/images/logo.svg" alt="logo"></div>

                    <div class="devices-status">
                        <div class="sircle_text">
                            <span class="sircle_text__label">EzSmart Devices</span>
                            <span class="sircle_text__item circle_blue">{{ scanners.length }}</span>
                        </div>
                        <div class="sircle_text">
                            <span class="sircle_text__label">EzSmart Online</span>
                            <span class="sircle_text__item circle_green">{{ onlineDevices }}</span>
                        </div>
                        <div class="sircle_text">
                            <span class="sircle_text__label">EzSmart Disconnect</span>
                            <span class="sircle_text__item circle_red">{{ offlineDevices }}</span>
                        </div>
                    </div>
                </div>
            </header>
            <gMap
                ref="mapRef"
                v-if="isScanners"
                :locations=locations
            ></gMap>
        </div>
        <preloader :preloaderState="preloaderState"></preloader>

        <promptModal v-on:userEmail="userEmailHandler" ref="promptModal"></promptModal>
    </div>
</template>

<style scoped lang="sass">
.client-view
    display: flex
    flex-direction: column
    height: 100%

    .header
        margin-bottom: 12px

        &__top
            display: flex
            position: relative
            align-items: center
            justify-content: space-between
            border-bottom: none
            padding: 24px

            .back
                position: static
                transform: unset

                .back_btn
                    margin-left: 3px
                    vertical-align: baseline
                    text-decoration: underline
                    color: #3498db

                    &:hover
                        color: lighten(#3498db, 10%)

            .logo
                position: absolute
                left: calc(50% - 35px)
                margin: 0

            @media screen and (max-width: 1550px)
                padding: 5px 24px
                .logo
                    position: static
            @media screen and (max-width: 1100px)
                padding: 5px 24px 15px 24px
                flex-direction: column
                .back
                    margin: 10px 0 15px 0
                .logo
                    order: -1
</style>

<script>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css'
import gMap from '@/components/gMap/gMap'
import promptModal from "@/components/modals/promptModal/promptModal";
import {getLinkStatus, getScannersInfo, getInfoForShareLink, checkEzlogzMail} from "@/helpers/queries";

export default {
    name: 'ClientView',
    props: {
        hash: String
    },
    components: {
        gMap,
        Loading,
        promptModal
    },
    data() {
        return {
            preloaderState: true,
            scanners: [],
            locations: {
                imgClusterType: 'ezSmart',
                locations: []
            },
            userRole: localStorage.getItem('userRole'),
            expirationDate: null
        }
    },
    methods: {
        formatScanners(initialScanners) {
            initialScanners.forEach((item, index) => {
                if (!item.errorCode) {
                    this.scanners.push({
                        id: index,
                        label: `WQ-${item.BLEAddress}`,
                        value: item.BLEAddress,
                        status: item['status-scanner']
                    });
                }
            });
        },
        formatLocations(scannersArr) {
            let result = {
                imgClusterType: 'ezSmart',
                locations: []
            }
            scannersArr.forEach((item, index) => {
                if (!item.errorCode) {
                    result.locations.push({
                        id: index,
                        cords: item.locations,
                        lat: item.locations ? item.locations[1].lat : undefined,
                        lng: item.locations ? item.locations[1].lng : undefined,
                        name_point: item.BLEAddress,
                        title: `WQ-${item.BLEAddress}`,
                        status: item.locations ?
                            (
                                (item['status-scanner'] && item.locations[0].speedkmh != 0) ? 'dr' :
                                    item['status-scanner'] ? 'on' : 'of'
                            ) : undefined,
                        userName: `${item['user-info'].name} ${item['user-info'].lastName}`,
                        truckName: item['truck-info'].name,
                        truckVin: item['truck-info'].vin,
                        fuelLevel: item.locations[1].fuellevel,
                        speed: item.locations[1].speedmph
                    })
                }
            });

            return result;
        },
        clearMapInterval() {
            // this.$refs.mapRef.clearTimer();
            this.$refs.mapRef.clearMarkers();
        },
        dataErrorHandler() {
            this.preloaderState = false;
            window.showAlertModal("Error while loading data from server", "/login");
        },
        getScannersHandler(hash, userRole) {
            getScannersInfo(hash, userRole).then((response) => {
                const scannersData =  {macAddress: response.data.scanners};
                this.expirationDate = new Date(response.data.expirationDate);

                this.getShareInfo(scannersData, userRole);
            }, this.dataErrorHandler)
        },
        getShareInfo(data, userRole) {
            getInfoForShareLink(data, userRole).then((response) => {
                this.formatScanners(response.data);
                if (!this.scanners.length) {
                    this.preloaderState = false;
                    window.showAlertModal("The requested scanners are invalid", "/login");
                }
                this.locations = this.formatLocations(response.data);

                this.preloaderState = false;
            }, this.dataErrorHandler);

            let shareLinkInterval = setInterval(() => {
                if (this.expirationDate < new Date()) {
                    clearInterval(shareLinkInterval);

                    window.showAlertModal("The link has expired", "/login");
                }

                getInfoForShareLink(data, userRole).then((response) => {
                    this.scanners = [];
                    this.clearMapInterval();

                    this.formatScanners(response.data);
                    this.$refs.mapRef.setMarkers(this.formatLocations(response.data).locations);
                }, () => {
                    clearInterval(shareLinkInterval);
                    this.dataErrorHandler()
                });
            }, 150000);
        },
        userEmailHandler(email) {
            this.$refs.promptModal.hidePromptModal();

            checkEzlogzMail({
                email: email,
                link: this.hash
            }).then((response) => {
                if (response.data) {
                    window.showAlertModal("You must be registered to use private links", "/login");
                } else {
                    this.getScannersHandler(this.hash);
                }
            }, this.dataErrorHandler);
        }
    },
    computed: {
        onlineDevices() {
            return this.scanners.filter(item => item.status).length
        },
        offlineDevices() {
            return this.scanners.filter(item => !item.status).length
        },
        isScanners() {
            return !!this.scanners.length;
        }
    },
    mounted() {
        getLinkStatus(this.hash).then((response) => {
            const status = response.data;

            if (status === 0) {
                this.getScannersHandler(this.hash);
            } else if (status === 1) {
                if (!this.$store.getters.isAuthenticated) {
                    this.preloaderState = false;
                    this.$refs.promptModal.showPromptModal();
                } else {
                    this.getScannersHandler(this.hash, this.userRole);
                }
            } else if (status === 2) {
                this.preloaderState = false;
                window.showAlertModal("The link has expired", "/login");
            }
        }, (error) => {
            this.preloaderState = false;
            window.showAlertModal("Link is invalid", "/login");
        });
    }
}
</script>