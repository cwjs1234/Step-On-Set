$(document).ready(function () {

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
    
    $.ajax({
        type: "GET",
        url: "https://api.themoviedb.org/3/" + type + "/" + id + "?api_key=2a003eac1e43e6fe5bdc089dbc8e7c2e&language=en-US",
        dataType: "json",

        success: function (data) {
            var posterPath = "https://image.tmdb.org/t/p/original" + data.poster_path;
            var description = data.overview;
            console.log(description);
            var title;
            if (type == "tv"){
                title = data.name;
            } else if (type = "movie"){
                title = data.title;
            }
            $("#mainPoster").attr("src", posterPath);
            $("#titleName").append(title);
            $("#titleDescription").append(description);
        }
    })
});