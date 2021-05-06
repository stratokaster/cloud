<template>
    <div class="dashboard">
        <div class="page__content">
            <header class="header">
                <div class="header__top">
<!--                    <div class="back">-->
<!--                        <a href="#" class="back_btn">-->
<!--                            <i class="icon-icons-editor-ic-download"></i>-->
<!--                            Back to Dashboard-->
<!--                        </a>-->
<!--                    </div>-->
                    <div class="logo"><img src="@/assets/images/logo.svg" alt=""></div>
                </div>
                <div class="header__bottom">
                    <div class="select-list" v-if="scanners.length">
                        <ezSelect
                            :show-select-all= "false"
                            selectAllText="Select All Scanners"
                            :selectList="scanners"
                            id="list1"
                            selectLabel="Select Scanner"
                            @share:click="getSelectedOptions"
                            shareButton="Show scanners"
                        ></ezSelect>
                    </div>

                    <div class="devices-status">
                        <div class="sircle_text">
                            <span class="sircle_text__label">EzSmart Devices</span>
                            <span class="sircle_text__item circle_blue">{{ (locations.locations) ? locations.locations.length : 0 }}</span>
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

                <p v-if="invalidScanners.length" class="invalid-devices">
                    <span style="color: #ed5554">Invalid Devices:</span> {{invalidScanners.join(", ")}}
                </p>
            </header>
            <gMap
                ref="mapRef"
                :locations="locations"
                :isAnimate="false"
            ></gMap>
        </div>
    </div>
</template>

<style lang="sass" scoped>
    .invalid-devices
        margin: 0 15px 15px 23px
        span
            color: #ed5554
</style>

<script>
import {getSuperAdminScanners, getInfoForShareLink} from '@/helpers/queries.js'
import gMap from '@/components/gMap/gMap'

export default {
    name: 'SuperAdmin',
    data() {
        return  {
            scanners: [],
            selectedList: [],
            locations: {},
            invalidScanners: []
        }
    },
    components: {
        gMap
    },
    computed: {
        onlineDevices() {
            return (this.locations.locations) ? this.locations.locations.filter(item => item.statusScanner).length : 0
        },
        offlineDevices() {
            return (this.locations.locations) ? this.locations.locations.filter(item => !item.statusScanner).length : 0
        },
        isScanners() {
            return !!this.scanners.length;
        }
    },
    methods: {
        getSelectedOptions(data) {
            const scannersData =  {macAddress: data.map(item => item.value.replace(/(\S+)-/, ""))};

            getInfoForShareLink(scannersData).then((response) => {
                this.locations = this.setLocations(response.data);
            }, () => {
                alert("error while loading scanner locations Data from server");
            });
        },
        formatScanners(initialScanners) {
            let result = [];

            initialScanners.forEach((item, index) => {
                result.push({
                    id: index,
                    label: item.BLEAddress,
                    value: item.BLEAddress,
                    selected: false
                });
            });

            this.scanners = result;
        },
        setLocations(scannersArr) {
            this.invalidScanners = [];

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
                        statusScanner: item['status-scanner'],
                        fuelLevel: item.locations[1].fuellevel,
                        speed: item.locations[1].speedmph
                    })
                } else {
                    this.invalidScanners.push(item.BLEAddress);
                }
            });

            this.$refs.mapRef.clearMarkers();

            if (result.locations.length) {
                this.$refs.mapRef.setMarkers(result.locations);
                this.$refs.mapRef.fitBounds();
            }

            return result;
        },
    },
    created() {
        getSuperAdminScanners().then((response) => {
            this.formatScanners(response.data);
        }, () => {
            alert("error while loading data from server");
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            this.$router.push("/login");
        })
    },
}
</script>