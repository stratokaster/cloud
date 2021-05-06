<template>
    <div class="dashboard">
        <div class="page__content">
            <header class="header">
                <div class="header__top">
                    <div class="back">
                        <a href="https://ezlogz.com/dash/" class="back_btn">
                            <i class="icon-icons-editor-ic-download"></i>
                            Back to Dashboard
                        </a>
                    </div>
                    <div class="logo"><img src="@/assets/images/logo.svg" alt=""></div>
                </div>
                <div class="header__bottom">
                    <div class="select-list" v-if="selectList">
                        <ezSelect
                            selectAllText="Select All Scanners"
                            :selectList="selectList"
                            id="list1"
                            selectLabel="Select Scanner"
                            @share:click="getSelectedOptions"
                        ></ezSelect>
                    </div>

                    <div class="devices-status">
                        <div class="sircle_text">
                            <span class="sircle_text__label">EzSmart Devices</span>
                            <span class="sircle_text__item circle_blue">{{ selectList.length }}</span>
                        </div>
                        <div class="sircle_text">
                            <span class="sircle_text__label">EzSmart Online</span>
                            <span class="sircle_text__item circle_green">{{ onlineDevices }}</span>
                        </div>
                        <div class="sircle_text">
                            <span class="sircle_text__label">EzSmart Disconect</span>
                            <span class="sircle_text__item circle_red">{{ oflineDevices }}</span>
                        </div>
                    </div>
                </div>
            </header>
            <gMap
                ref="mapRef"
                v-if="setLocations.locations.length"
                :locations=setLocations
            ></gMap>
        </div>
        <modal name="shareModal" :maxWidth="619" height="auto" :adaptive="true">
            <shareModal :props="selectedList"></shareModal>
        </modal>

        <preloader :preloaderState="preloaderState"></preloader>
    </div>
</template>
<script>
import {getlastLocationWithInfo} from '@/helpers/queries.js'
import {mapGetters, mapActions} from 'vuex'
import gMap from '@/components/gMap/gMap'
import shareModal from '@/components/shareModal/shareModal'
import 'vue-loading-overlay/dist/vue-loading.css'

export default {
    data: () => ({
        preloaderState: true,
        userRole: null,
        scaners: [],
        selectedList: [],
        btnsList: [
            {btnText: 'EzSmart', btnValue: 0},
            {btnText: 'EzDashCam', btnValue: 1}
        ],
        activeBtn: {btnText: 'EzSmart', btnValue: 0},
        inpVal: 'asdasdasd',
        scanersIdsList: [],
        scanersLocations: null,
        zoom: 10,
        center: {
            lat: 0, lng: 0
        },
        locations: {
            imgClusterType: 'ezSmart',
            locations: [],
        },
    }),
    components: {
        gMap,
        shareModal,
    },
    computed: {
        ...mapGetters([
            'isScanerAdd',
            'getScaners'
        ]),
        selectList() {
            this.scaners.length = 0;
            if (this.isScanerAdd) {
                this.getScaners.forEach((item, index) => {
                    if (!item.errorCode) {
                        this.scaners.push({
                            id: index,
                            label: `WQ-${item.BLEAddress}`,
                            value: item.BLEAddress,
                            status: item['status-scanner'],
                            selected: false
                        })
                    }
                });

                this.preloaderState = false;
            }
            return this.scaners;
        },
        onlineDevices() {
            return this.selectList.filter(item => item.status).length
        },
        oflineDevices() {
            return this.selectList.filter(item => !item.status).length
        },
        setLocations() {
            if (this.isScanerAdd) {
                this.getScaners.forEach((item, index) => {
                    if (!item.errorCode) {
                        this.locations.locations.push({
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
            }
            return this.locations;
        }
    },
    created() {
        this.userRole = localStorage.getItem('userRole');
        if (this.userRole) {
            let data = {macAddress: []}
            this.$store.dispatch('GetLastLocations', data);

            let mapRefreshInterval = setInterval(() => {
                getlastLocationWithInfo(this.userRole, data).then((response) => {
                    // this.$refs.mapRef.clearTimer();
                    this.$refs.mapRef.clearMarkers();
                    this.$refs.mapRef.setMarkers(this.formatLocations(response.data).locations);
                }, () => {
                    clearInterval(mapRefreshInterval);
                    window.showAlertModal("Error while loading data from server");
                });
            }, 150000);
        }
    },
    methods: {
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
                        truckVin: item['truck-info'].vin
                    })
                }
            });

            return result;
        },
        getSelectedOptions(data) {
            this.selectedList = data;
            this.$modal.show('shareModal')
        }
    }
}
</script>
<style lang="sass">
@import '../assets/style/style.sass'
.dashboard
    display: flex
    flex-direction: column
    height: 100%
    .header__top
        @media screen and (max-width: 700px)
            flex-direction: column
            align-items: center
            .back
                position: static
                margin: 15px 0 10px 0
                transform: translateY(0)

.page
    &__content
        display: flex
        flex-direction: column

.header
    margin-bottom: 24px

    &__top
        display: flex
        align-items: center
        position: relative

        .back
            position: absolute
            left: 24px
            top: 50%
            transform: translateY(-50%)
            z-index: 1

.select-list
    width: 100%
    max-width: 400px
    @media screen and (max-width: 1100px)
        margin-bottom: 20px

.devices-status
    @media screen and (max-width: 700px)
        display: flex
        flex-direction: column
        align-items: center


.sircle_text
    display: inline-flex
    align-items: center
    font-size: 16px
    padding-left: 18px
    @media screen and (max-width: 700px)
        padding-left: 0
        &+.sircle_text
            margin-top: 10px
        &__label
            padding-right: 0
            width: 170px

    &__label
        white-space: nowrap
        padding-right: 12px

    &__item
        display: inline-flex
        align-items: center
        justify-content: center
        flex: 0 0 32px
        width: 32px
        height: 32px
        border-radius: 50%
        font-weight: 500
        font-size: 14px

.circle_blue
    background-color: $primary
    color: white

.circle_green
    background-color: $asparagus
    color: white

.circle_red
    background-color: $coral
    color: white


.map
    padding-top: 24px
    flex-grow: 1

    &__container
        height: 100%
        border-radius: 4px
        overflow: hidden

        #map
            height: 100%
            width: 100%
            background: $cloudy-blue
</style>