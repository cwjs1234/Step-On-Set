$('#submitSearch').on('click', function(){
    var searchQuery = $('#searchBar').val()
    console.log('searchQuery');
    window.location = "file:///C:/Users/consp/Documents/Step%20On%20Set/index.html/?search=" + searchQuery;
});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

console.log(getParameterByName('search'));