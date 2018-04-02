$(document).ready(function () {

    var latestTvTitles = [];
    var latestMovieTitles = [];

    function removeDuplicates(arr){
        var unique_array = []
        for(var i = 0;i < arr.length; i++){
            if(unique_array.indexOf(arr[i]) == -1){
                unique_array.push(arr[i])
            }
        }
        return unique_array;
    }


    //<<----- Get Latest TV Titles ----->>
    firebase.firestore().collection("locations").where("isTv", "==", true)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            latestTvTitles.push(doc.data().titleId);
        });
        latestTvTitles = removeDuplicates(latestTvTitles);
        showLatest("tv", ".latest-tv-titles", latestTvTitles);
    })
    .catch(function(error) {
    });

     //<<----- Get Latest Movie Titles ----->>
     firebase.firestore().collection("locations").where("isTv", "==", false)
     .get()
     .then(function(querySnapshot) {
         querySnapshot.forEach(function(doc) {
             latestMovieTitles.push(doc.data().titleId);
         });
         latestMovieTitles = removeDuplicates(latestMovieTitles);
         showLatest("movie", ".latest-movie-titles", latestMovieTitles );
     })
     .catch(function(error) {
     }); 


    function showLatest(type, div, array) {
    for (x=0; x<6; x++){
    
        $.ajax({
            type: "GET",
            url: "https://api.themoviedb.org/3/" + type + "/" + array[x] + "?api_key=2a003eac1e43e6fe5bdc089dbc8e7c2e&language=en-US",
            dataType: "json",

            success: function (data) {
                var posterPath = "https://image.tmdb.org/t/p/original" + data.poster_path;
                var title;
                if (type == "tv"){
                    title = data.name;
                } else if (type = "movie"){
                    title = data.title;
                }
                console.log(posterPath);
                $(div).append("<div class=\"col-md-2 titles\">" +
                                           "<img alt=\"Bootstrap Image Preview\" src=" + posterPath + " width=\"200\" id=\"" + data.id + "\" type=\"" + type + "\" />" +
                                           "<br> <span>" + title + " </span> </div>")
            }
        })
    }
}

$(document).on('click','.titles > img', function(){
    type = $(this).attr("type");
    id = $(this).attr("id");
    window.location.replace("title.html?type=" + type + "&id=" + id );
 }) 
    


});

