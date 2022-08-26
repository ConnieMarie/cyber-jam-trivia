var apiKey = "+UAPOEz8eS3RqXRJjvFjxA==jfNUZHAlHVThyjIt"

var category = 'music';
$.ajax({
    method: 'GET',
    url: 'https://api.api-ninjas.com/v1/trivia?category=' + category,
    headers: { 'X-Api-Key': apiKey},
    contentType: 'application/json',
    success: function(result) {
        console.log(result);
    },
    error: function ajaxError(jqXHR) {
        console.error('Error: ', jqXHR.responseText);
    }
});