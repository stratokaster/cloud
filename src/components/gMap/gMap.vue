<template>
    <div ref='googleMap' class='google-map'></div>
</template>
<script>
const imgClusterUrl = 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m';

export default {
    data: ()=>({
        bounds: new google.maps.LatLngBounds(),
        mapOptions: {
            center: { lat: 39.0985115, lng: -94.8064664 },
            zoom: 5,
            gestureHandling: 'greedy',
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: true,
            disableDefaultUi: false,
        },
        map: null,
        directionsService: null,
        markers: {
            on: require('../../assets/images/marker_on.svg'),
            dr: require('../../assets/images/marker_dr.svg'),
            of: require('../../assets/images/marker_of.svg')
        },
        markersArr: [],
        // directionsRendererArr: [],
        state: {
            isRunning: true,
            timeOut: null
        },
        markerCluster: null
    }),
    props: {
        locations: {
            type: [Array, Object],
            required: true
        },
        isAnimate: {
            type: Boolean,
            default: true
        }
    },
    mounted() {
        if(this.locations){
            this.initMap();
        }
    },
    methods: {
        initMap() {
            this.directionsService = new google.maps.DirectionsService();

            let { imgClusterType, locations } = this.locations;
            // create map
            this.map = new google.maps.Map(this.$refs.googleMap, {
                ...this.mapOptions
            });

            this.map.infowindow = new google.maps.InfoWindow();
            // create Markers
            if (locations && locations.length) {
                // for (let i = 0; i < locations.length; i++) {
                //     this.directionsRendererArr.push(new google.maps.DirectionsRenderer({
                //         suppressMarkers: true,
                //         preserveViewport: true
                //     }));
                //
                //     this.directionsRendererArr[i].setMap(this.map);
                // }

                this.setMarkers(locations);

                // авто масштабирование
                this.map.fitBounds(this.bounds);
            }
        },
        bindInfoWindow(marker, map, content) {
            google.maps.event.addListener(marker, 'click', function() {
                map.infowindow.setContent(content);
                map.infowindow.open(map, marker);
            });
        },
        setMarkers(locations){
            for (let [index, location] of locations.entries()) {
                let setLocations = new google.maps.LatLng(location.lat, location.lng);

                this.bounds.extend(setLocations);

                let marker = new google.maps.Marker({
                    position: setLocations,
                    map: this.map,
                    clickable: true,
                    title: `${location.title}`,
                    icon: {
                        url: this.markers[location.status],
                        anchor: {x: 20, y: 20},
                        // size: {width: 40, height: 40, f: 'px', b: 'px',},
                        scaledSize: {width: 40, height: 40, f: 'px', b: 'px',},
                    }
                });
                let content = `
                    <div style="padding: 0 5px; line-height: 2; font-family: 'Roboto', sans-serif; font-weight: 400;">
                        <span class="font-size: 12px; line-height: 0;">Last Driver</span>
                        <h4 style="font-size: 18px; line-height: 1; margin-bottom: .5em;">${location.userName}</h4>
                        <p>Scanner: <strong>${location.title}</strong></p>
                        <p>Truck Name: <strong>${location.truckName}</strong></p>
                        <p>Vin: <strong>${location.truckVin}</strong></p>
                        <p>Location: <strong>${location.lat}, ${location.lng}</strong></p>
                        <p>Fuel level: <strong>${location.fuelLevel}</strong></p>
                        <p>Speed: <strong>${location.speed} miles per hour</strong></p>
                    </div>
                `
                this.bindInfoWindow(marker, this.map, content)
                this.markersArr.push(marker);

                if (this.isAnimate && location.status === 'dr') {
                    this.calculateAndDisplayRoute(
                        new google.maps.LatLng(location.cords[1].lat, location.cords[1].lng),
                        new google.maps.LatLng(location.cords[0].lat, location.cords[0].lng),
                        marker
                    );
                }
            }

            // create MarkerClusterer and add Image
            // this.markerCluster = new MarkerClusterer(this.map, this.markersArr, { imagePath: imgClusterUrl });
        },
        animateMarker(marker, coordsArray, totalDistance) {
            const requestRefreshTimeInSeconds = 150;
            let state = this.state;
            var delay = 100;
            var target = 1;
            var km_h = calculateSpeed(totalDistance);

            function goToPoint() {
                var lat = marker.position.lat();
                var lng = marker.position.lng();
                var dest = coordsArray[target];

                if (!dest) {
                    return;
                }

                var distance = google.maps.geometry.spherical.computeDistanceBetween(dest, marker.position); // in meters

                var step = (km_h * 1000 * delay) / 3600000; // in meters

                var numStep = distance / step;
                var i = 0;
                var deltaLat = (dest.lat() - lat) / numStep;
                var deltaLng = (dest.lng() - lng) / numStep;

                function moveMarker() {
                    lat += deltaLat;
                    lng += deltaLng;
                    i += step;

                    if (i < distance) {
                        marker.setPosition(new google.maps.LatLng(lat, lng));
                        state.timeOut = setTimeout(moveMarker, delay);
                    } else {
                        if (target < coordsArray.length) {
                            marker.setPosition(dest);
                            target++;

                            state.timeOut = setTimeout(goToPoint, delay);
                        }
                    }
                }
                moveMarker();
            }
            function calculateSpeed(meters) {
                // *3.6 converting from m/s to km/h

                return meters / requestRefreshTimeInSeconds * 3.6;
            }
            goToPoint();
        },
        calculateAndDisplayRoute(origin, destination, marker) {
            this.directionsService.route(
                {
                    origin: origin,
                    destination: destination,
                    travelMode: google.maps.TravelMode.DRIVING
                },
                (response, status) => {
                    if (status === "OK") {
                        // renderer.setDirections(response);

                        this.animateMarker(marker, response.routes[0].overview_path, google.maps.geometry.spherical.computeDistanceBetween(destination, origin))
                        // console.log(response);
                    } else {
                        // window.showAlertModal("Directions request failed due to " + status);
                    }
                }
            );
        },
        clearTimer() {
            clearTimeout(this.state.timeOut);
            this.state.timeOut = null;
        },
        clearMarkers() {
            for (let i = 0; i < this.markersArr.length; i++) {
                this.markersArr[i].setMap(null);
            }
            this.markerCluster = null;
            this.markersArr = [];
        },
        animateMarkers(locations) {
            for (let i = 0; i < locations.length; i++) {
                if (this.markersArr[i]) {
                    if (locations[i].status !== 'of') {
                        this.animateMarker(this.markersArr[i], locations[i].cords, false);
                    }
                }
            }
        },
        fitBounds() {
            this.map.fitBounds(this.bounds);
        }
    }
}
</script>
<style lang="sass" >
.google-map
    width: 100%
    height: 100%
    border-radius: 4px
.gm-ui-hover-effect
    top: 0 !important
    right: 0 !important
</style>