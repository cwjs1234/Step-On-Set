$(document).ready(function(){

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
        console.log(latestTvTitles);
        showTitles("tv", "#tvList", latestTvTitles);
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
         showTitles("movie", "#movieList", latestMovieTitles );
     })
     .catch(function(error) {
     }); 

     function showTitles(type, list, array) {
        for (x=0; x<array.length; x++){
        
            $.ajax({
                type: "GET",
                url: "https://api.themoviedb.org/3/" + type + "/" + array[x] + "?api_key=2a003eac1e43e6fe5bdc089dbc8e7c2e&language=en-US",
                dataType: "json",
    
                success: function (data) {
                    var title;
                    if (type == "tv"){
                        title = data.name;
                    } else if (type = "movie"){
                        title = data.title;
                    }
                    $(list).append("<p> <a href=\"title.html?type=tv&id=1399</a> </p>")
                }
            })
        }
    }


});