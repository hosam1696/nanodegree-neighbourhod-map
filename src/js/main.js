class Place {
    constructor(title, latlng) {
        this.title = title;
        this.latlng = latlng;
    }
}
class AppViewModel {

    constructor() {
        this.places = [
            new Place('Saratoga Library', [37.270025, -122.0162]),
            new Place('Saint Andrew\'s Episcopal School', [37.2714124, -122.0165007]),
            new Place('Sofmen - Web & Mobile Development', [37.2721832, -122.0142492]),
            new Place('Warner Hutton House', [37.267423, -122.0166872]),
            new Place('post office', [37.2668765, -122.0164405]),
            new Place('Redwood Middle School', [37.2651859, -122.014638]),
            new Place('Fruitivale Ave', [37.2677997, -122.0149752]),
            
        ]
        this.firstName = ko.observable('gyg');
        this.searchInput = document.getElementById('search-input');
        this.searchValue = ko.observable('');
        this.neighbourAreas = ko.observableArray(this.places);
        this.isHidden = ko.observable(true);
        this.markers = [];
        this.loadMap(this.places);
    }
    capital() {
        var currentVal = this.lastName();        // Read the current value
        this.lastName = currentVal.toUpperCase(); // Write back a modified value
    }

    generate() {
        this.firstName(Math.random());
    }

    showAreas() {
        document.querySelector('.map-areas').classList.remove('hidden');
    }
    hideAreas( event) {
        console.log(event);
        /*
        setTimeout(() => {
            document.querySelector('.map-areas').classList.add('hidden');
        }, 10)*/
    }

    findPlace(d) {
        console.log(this.markers,'data', d);

    }

    filter() {
        let inputValue = this.searchInput.value;
        let reg = new RegExp(inputValue, 'gi');
        let filtered = this.places.slice().filter(place => place.title.search(reg) >= 0)
            .map(place => {return { latlng: place.latlng, title: place.title.replace(reg, '<span class="highlight">$&</span>')};});
        //this.neighbourAreas = ko.observableArray(filtered);
        console.log(filtered, this.neighbourAreas.length, this.places);
        this.loadMap(filtered);
        this.neighbourAreas.destroyAll();
        this.neighbourAreas.push(...filtered);
        this.showAreas();
        
    }

    loadMap(places) {
        let self = this;

        google.maps.event.addDomListener(window, 'load', init);

        function init() {
            let myLat = new google.maps.LatLng(...places[0].latlng); // silicon valley;
            let mapOptions = {
                zoom: 15,
                center: myLat,
                //styles: [{ "featureType": "all", "elementType": "all", "stylers": [{ "visibility": "on" }] }, { "featureType": "all", "elementType": "labels", "stylers": [{ "visibility": "off" }, { "saturation": "-100" }] }, { "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "saturation": 36 }, { "color": "#000000" }, { "lightness": 50 }, { "visibility": "off" }] }, { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [{ "visibility": "off" }, { "color": "#000000" }, { "lightness": 20 }] }, { "featureType": "all", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#000000" }, { "lightness": 20 }] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#000000" }, { "lightness": 17 }, { "weight": 1.2 }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 20 }] }, { "featureType": "landscape", "elementType": "geometry.fill", "stylers": [{ "color": "#4d6059" }] }, { "featureType": "landscape", "elementType": "geometry.stroke", "stylers": [{ "color": "#4d6059" }] }, { "featureType": "landscape.natural", "elementType": "geometry.fill", "stylers": [{ "color": "#4d6059" }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "lightness": 21 }] }, { "featureType": "poi", "elementType": "geometry.fill", "stylers": [{ "color": "#4d6059" }] }, { "featureType": "poi", "elementType": "geometry.stroke", "stylers": [{ "color": "#4d6059" }] }, { "featureType": "road", "elementType": "geometry", "stylers": [{ "visibility": "on" }, { "color": "#7f8d89" }] }, { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "color": "#7f8d89" }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#7f8d89" }, { "lightness": 17 }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#7f8d89" }, { "lightness": 29 }, { "weight": 0.2 }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 18 }] }, { "featureType": "road.arterial", "elementType": "geometry.fill", "stylers": [{ "color": "#7f8d89" }] }, { "featureType": "road.arterial", "elementType": "geometry.stroke", "stylers": [{ "color": "#7f8d89" }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 16 }] }, { "featureType": "road.local", "elementType": "geometry.fill", "stylers": [{ "color": "#7f8d89" }] }, { "featureType": "road.local", "elementType": "geometry.stroke", "stylers": [{ "color": "#7f8d89" }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#000000" }, { "lightness": 19 }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#2b3638" }, { "visibility": "on" }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#2b3638" }, { "lightness": 17 }] }, { "featureType": "water", "elementType": "geometry.fill", "stylers": [{ "color": "#24282b" }] }, { "featureType": "water", "elementType": "geometry.stroke", "stylers": [{ "color": "#24282b" }] }, { "featureType": "water", "elementType": "labels", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "labels.text", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }]
            };

            let mapElement = document.getElementById('app-map');
            let map = new google.maps.Map(mapElement, mapOptions);
            function makeMarker(loc, title = 'silicon Valley') {
                myLat = new google.maps.LatLng(...loc); // Cairo;
                let marker = new google.maps.Marker({
                    position: myLat,
                    map: map,
                    //draggable: true,
                    animation: google.maps.Animation.DROP,
                    title
                });
                self.markers.push(marker);
                marker.addListener('click', debounce);
                
                marker.setMap(map);

                function debounce() {
                    if (marker.getAnimation() !== null) {
                        marker.setAnimation(null);
                    } else {
                        marker.setAnimation(google.maps.Animation.BOUNCE);
                        setTimeout(() => {
                            marker.setAnimation(null);
                        }, 850)
                    }
                }
            }
            
            places.forEach(place => {
                makeMarker(place.latlng, place.title);
            });
            console.log(self.markers);
        }
    }
}

// Activates knockout.js
ko.applyBindings(new AppViewModel());

