$(document).ready(function () {

    var movieUrl = "https://api.themoviedb.org/3/search/movie?api_key=2a003eac1e43e6fe5bdc089dbc8e7c2e&query=";
    var tvUrl = "https://api.themoviedb.org/3/search/tv?api_key=2a003eac1e43e6fe5bdc089dbc8e7c2e&query=";
    var passedUrl;

    $('input[type=radio][name=movie-tv]').change(function ( ) {
        if (this.value == 'movie') {
            passedUrl = movieUrl; 
        } else if (this.value == 'tv') {
            passedUrl = tvUrl;
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

                movieId = id; //movieId exists in submitLocation.html script


            }
        }) }
    });



    /*  $("#movie").keypress(function () {

          var entry = $("#movie").val();

          titleChoice.length = 0;
          $.ajax({
              type: "GET",
              url: passedUrl + entry,
              dataType: "json",

              success: function (data) {
                  for (var i = 0; i < 3; i++) {
                      var title = data.results[i].title;
                      var newLength = titleChoice.push(title);
                      console.log(title);
                      console.log(titleChoice);
                  }
              }
          })

      }) */

});