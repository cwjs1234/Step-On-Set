$(document).ready(function () {

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
      }); 

    var locationName;
    var fictionalName;
    var description;
    var locationImageUrl;
    var allLocations = [];

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    var id = getParameterByName('id');
    var type = getParameterByName('type');
    var bool;

        //<<----- Get Latest Locations ----->>
        if (type == "movie"){
           bool = false;
        } else if (type == "tv"){
           bool = true;
        }

        firebase.firestore().collection("locations").where("isTv", "==", bool).where("titleId", "==", parseInt(id))
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                locationName = doc.data().name;
                fictionalName = doc.data().fictionalName;
                description = doc.data().description;
                locationImageUrl = doc.data().image;
                lat = doc.data().lat
                lng = doc.data().lng
                latLng = {lat: parseFloat(lat), lng: parseFloat(lng)}
                allLocations.push(latLng);
                $("#locations").append("<tr> <td> <img src=\"" + locationImageUrl + "\" width=\"400\"> </td> <td>" + locationName + "</td>" + 
                                       "<td> " + fictionalName + " </td> <td> " + description + " </td> <td> <img class=\"map-viewer\" src=\"images/viewonmap.svg\" width=\"30\" lat=\"" + lat + "\" lng=\"" + lng + "\" data-toggle=\"modal\" data-target=\"#map-modal\"> </td> </tr>" );
                
            });
            console.log(allLocations);
        })
        .catch(function(error) {
        });
    
    $.ajax({
        type: "GET",
        url: "https://api.themoviedb.org/3/" + type + "/" + id + "?api_key=2a003eac1e43e6fe5bdc089dbc8e7c2e&language=en-US",
        dataType: "json",

        success: function (data) {
            var posterPath = "https://image.tmdb.org/t/p/original" + data.poster_path;
            var description = data.overview;
            var title;
            var relDate;
            var background = "https://image.tmdb.org/t/p/original" + data.backdrop_path;
            if (type == "tv"){
                title = data.name;
                relDate = data.first_air_date;
            } else if (type = "movie"){
                title = data.title;
                relDate = data.release_date;
            }
            $('.div-bg').css('background-image', 'url(' + background + ')');
            $("#mainPoster").attr("src", posterPath);
            $("#titleName").append(title + " (" + relDate.substring(0,4) + ")");
            $("#titleDescription").append(description);
        }
    })


    function initMap() {
          map = new google.maps.Map(document.getElementById('map'), {
          zoom: 7,
        });
      } 

    $(document).on('click','.map-viewer', function(){
        initMap() // creates fresh map no markers
        var lat = ($(this).attr("lat"));
        var lng = ($(this).attr("lng"));
        latLng = {lat: parseFloat(lat), lng: parseFloat(lng)}
        var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            title: 'Hello World!'
          });
        map.setCenter(latLng)
     }) 

    $("#multi-viewer").on('click', function(){
        initMap(); //creates fresh map no markers
        for (i = 0; i < allLocations.length; i++) {  
            marker = new google.maps.Marker({
                 position: allLocations[i],
                 map: map
            });
            map.setCenter(allLocations[0]);
     }
    }); 
});