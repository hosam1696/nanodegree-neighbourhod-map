class Place {
    constructor(title, latlng) {
        this.title = title;
        this.latlng = latlng;
    }
}
class Wiki {
    constructor(title, body) {
        this.title = title;
        this.body = body;
    }
}
function  AppViewModel() {

        this.places = [
           // new Place('San Jose International Airport', [37.363923, -121.925047]),
            new Place('Saint Andrew\'s Episcopal School', [37.2714124, -122.0165007]),
            new Place('Sofmen - Web & Mobile Development', [37.2721832, -122.0142492]),
            new Place('Warner Hutton House', [37.267423, -122.0166872]),
            new Place('post office', [37.2668765, -122.0164405]),
            new Place('Redwood Middle School', [37.2651859, -122.014638]),
            new Place('Fruitivale Ave', [37.2677997, -122.0149752]),
        ];
        this.staticPlaces = this.places.slice();
        this.firstName = ko.observable('gyg');
        this.searchInput = $('#search-input');
        this.searchValue = ko.observable('');
        this.neighbourAreas = ko.observableArray(this.places);
        this.isHidden = ko.observable(true);
        AppViewModel.markers = [];
    this.showInfo = ko.observable(false);
        
    this.searchTitle = ko.observable('placeholder title');
    this.searchBody = ko.observable('placeholder body');
        $('.map-areas').slideUp(0);
        ko.options.useOnlyNativeEvents = true;
    

    this.capital = ()=> {
        var currentVal = this.lastName();        // Read the current value
        this.lastName = currentVal.toUpperCase(); // Write back a modified value
    }

    this.generate = ()=> {
        this.firstName(Math.random());
    }

    this.toggleArea = (up = false, event = null)=> {
        let mapAreas = $('.map-areas');
        //console.log(event,up);
        up ? (mapAreas.slideUp()) : (mapAreas.slideDown())
    }

    this.findPlace = (d) => {
        console.log(AppViewModel.markers,'search wiki for', d.title);
        let self = this;
        //let searchUrl = 'https://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&search'
        let searchUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=' + d.title;
        let requestLink = 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exsentences=2&explaintext=&exsectionformat=plain&titles=';
        $.get(searchUrl,{datatype: "jsonp", origin:'*'})
            .done((data) => {
                let len = data[1].length,
                    index = Math.floor(Math.random()*len),
                    title = data[1][index];
                title = title.replace(/\s+/g,'_');
                console.group('WIKI URL SEARCH');
                console.log('SearchUrl Wiki data', data);
                console.log('Title', title);
                console.groupEnd();
                $.post(requestLink.concat(title),{datatype:'jsonp', origin: '*'})
                    .done((data)=>{
                        let page = data.query.pages,
                            key = Object.keys(page)[0];
                        self.createInfoBox(new Wiki(page[key].title,page[key].extract))
                        console.group('WIKI SEARCH RESULT');
                        console.log('DATA', data,'\n\b',page[key].title,page[key].extract);
                        console.groupEnd();
                    })
            })
    }

    this.createInfoBox = (wiki) => {
        this.searchTitle(wiki.title).searchBody(wiki.body||'ooh.. content not available!');
        this.showInfo(true);
        console.log('the wiki',this.searchTitle(),'\ body\n', this.searchBody(), this.showInfo());
    }
    /*
    function responsible for filtering places the user enter


    */
    this.filter= () => {
        let inputValue = this.searchInput.val();
        if (inputValue && inputValue.trim()) {
            this.neighbourAreas.push(...this.places);
            let reg = new RegExp(inputValue, 'gi');
            let filtered = Array.from(this.places)
                .filter(place => place.title.search(reg) >= 0)
                .map(place => new Place(place.title.replace(reg, '<span class="highlight">$&</span>'), [...place.latlng]));

            this.loadMap(filtered);
            this.neighbourAreas.destroyAll();
            this.neighbourAreas.push(...filtered);
            this.places = this.staticPlaces;
            //this.showAreas();
        }
    }

    this.trackKey = (val, event) => {
        if (event.which === 13) {
            console.log(event);
            this.filter();
        }
    }

    /*
        a function responsible for initiating google maps


    */
    this.loadMap = (places) => {
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
                AppViewModel.markers.push(marker);
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
            //console.log(self.markers, places);
        }
    }

    this.loadMap(this.places);
}

// Activates knockout.js
ko.applyBindings(new AppViewModel());

