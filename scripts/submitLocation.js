var titleId;
var currentLat;
var currentLng;
var fictionalName;
var description;
var isTv;
var imageUrl;

function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: -33.8688,
            lng: 151.2195
        },
        zoom: 13,
        mapTypeId: 'roadmap'
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();

        console.log("map listen fired");

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: image,
                title: place.name,
                position: place.geometry.location,
                draggable: true
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }

            var photos = place.photos;
            imageUrl = photos[0].getUrl({'maxWidth': 600, 'maxHeight': 600});
        });

        map.fitBounds(bounds);

        google.maps.event.addListener(markers[0], 'dragend', function (evt) {
            document.getElementById('marker-info').innerHTML =
                '<p>Marker dropped: Current Lat: ' + evt.latLng.lat().toFixed(3) +
                ' Current Lng: ' + evt.latLng.lng().toFixed(3) + '</p>';
            console.log(evt);
            currentLat = evt.latLng.lat();
            currentLng = evt.latLng.lng();
        });

        google.maps.event.addListener(markers[0], 'dragstart', function (evt) {
            document.getElementById('marker-info').innerHTML =
                '<p>Currently dragging marker...</p>';
        });
    });
}

$("#wizardContainer").steps({
    headerTag: "h3",
    bodyTag: "section",
    transitionEffect: "slideLeft",
    autoFocus: true,
    onFinished: function (event, currentIndex) {
        fictionalName = document.getElementById('fictionalName').value
        description = document.getElementById('description').value
        firebase.firestore().collection("locations").add({
            lat: currentLat,
            lng: currentLng,
            titleId: titleId,
            name: $("#pac-input").val() ,
            fictionalName: fictionalName,
            isTv: isTv,
            description: description,
            submittedBy: firebase.auth().currentUser.uid,
            image: imageUrl
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }
});
  
      var movieUrl = "https://api.themoviedb.org/3/search/movie?api_key=2a003eac1e43e6fe5bdc089dbc8e7c2e&query=";
      var tvUrl = "https://api.themoviedb.org/3/search/tv?api_key=2a003eac1e43e6fe5bdc089dbc8e7c2e&query=";
      var passedUrl;
  
      $('input[type=radio][name=movie-tv]').change(function ( ) {
          if (this.value == 'movie') {
              passedUrl = movieUrl;
              isTv = false;
          } else if (this.value == 'tv') {
              passedUrl = tvUrl;
              isTv = true;
          }
      });
  
      var titleChoice = [];
      $("#movie").autocomplete({
          source: titleChoice
      });
  
  
      $("#getMovie").on('click', function () {
  
          var entry = $("#movie").val();
          console.log(entry);
  
          if ($("#movie").val() === "") $("#searchHelp").append("<p> Please enter a search term</p>")
          else {
  
          $("#movieContent").append();
          $.ajax({
              type: "GET",
              url: passedUrl + entry,
              dataType: "json",
  
              success: function (data) {
                  var id = data.results[0].id;
                  var posterURL = data.results[0].poster_path;
                  var overview = data.results[0].overview;
                  if ($('#movieRadio').is(':checked')) {
                      var title = data.results[0].title;
                      var relDate = data.results[0].release_date;
                  } else if ($('#tvRadio').is(':checked')) {
                      var title = data.results[0].name;
                      var relDate = data.results[0].first_air_date;
                  }
  
                  console.log()
  
                  console.log(data);
  
                  $("#movieInfo").empty().append("<h3>" + title + "</h3>" +
                      "<p> <b> Release Date: </b>" + relDate + "</p>" +
                      "<p> <b> Description: </b>" + overview + "</p>");
                  $("#moviePoster").attr("src", "https://image.tmdb.org/t/p/original" + posterURL);
  
                  titleId = id; 
  
              }
          }) }
      });
  
