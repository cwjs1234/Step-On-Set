$(document).ready(function () {

    var latestTitles = [];

    function removeDuplicates(arr){
        var unique_array = []
        for(var i = 0;i < arr.length; i++){
            if(unique_array.indexOf(arr[i]) == -1){
                unique_array.push(arr[i])
            }
        }
        return unique_array;
    }


    
    firebase.firestore().collection("locations").where("isTv", "==", true)
    .get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            latestTitles.push(doc.data().titleId);
        });
        latestTitles = removeDuplicates(latestTitles);
        showLatestTvShows();
    })
    .catch(function(error) {
    });


    function showLatestTvShows(){
    for (x=0; x<6; x++){

        $.ajax({
            type: "GET",
            url: "https://api.themoviedb.org/3/tv/" + latestTitles[x] + "?api_key=2a003eac1e43e6fe5bdc089dbc8e7c2e&language=en-US",
            dataType: "json",

            success: function (data) {
                var posterPath = "https://image.tmdb.org/t/p/original" + data.poster_path;
                var title = data.name;
                console.log(posterPath);
                $(".latest-titles").append("<div class=\"col-md-2 titles\">" +
                                           "<img alt=\"Bootstrap Image Preview\" src=" + posterPath + " width=\"260\" />" +
                                           "<br> <span>" + title + " </span> </div>")
            }
        })
    }
}
    


});

