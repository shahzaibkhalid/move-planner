/**
 * This function is executed every time we need to fetch data 
 * from Wikipedia and New York Times API.
 * 
 * First of all it reads the query string in input field and 
 * also image on the body, later it utilizes the function 
 * "getWikiData()" that sends an XMLHttpRequest to the
 * specified URL and returns an ES6 native promise which 
 * later is resolved using then/catch block.
 * 
 * Similarly, there's another function "getNYTData()" to 
 * fetch data from New York Times REST API, based on specific 
 * query and returns an ES6 based native promise, which 
 * resolved, shows the links to New York Times articles. 
 */
function update() {
    let addressQuery = document.getElementById('address').value;
    const img = document.getElementById('location-img');
    if(addressQuery.length > 0) {
        img.src = `https://maps.googleapis.com/maps/api/streetview?size=2300x200&location=${addressQuery}&key=AIzaSyDSOgBcZ2BJ_hgjvqkELltLJ2sjJkHLINY`;
        img.alt = addressQuery;
        document.getElementsByClassName('top-living-statement')[0].innerText = `So you want to move to ${addressQuery}?`;

        Array.from(document.getElementsByClassName('sub-heading')).forEach(function(element) {
            element.style.display = 'block';
        });

        getWikiData(addressQuery, 'GET')
        .then(function(data){
            let queryNames = data[1];
            let queryLinks = data[3];
            if(document.getElementById('wikipedia-container').innerText.length !== 0) {
                document.getElementById('wikipedia-container').innerHTML = '';
                for(let i=0; i<queryNames.length; i++) {
                    document.getElementById('wikipedia-container').innerHTML += `<div class="article-links"><a target="blank" href="${queryLinks[i]}">${queryNames[i]}</a></div>`;
                }
            } else {
                for(let i=0; i<queryNames.length; i++) {
                    document.getElementById('wikipedia-container').innerHTML += `<div class="article-links"><a target="blank" href="${queryLinks[i]}">${queryNames[i]}</a></div>`;
                }
            }
        })
        .catch(function(error){
            document.getElementById('wikipedia-container').innerHTML = `Couldn't load Wikipedia artciles. Please try again.`;
        })

        getNYTData(addressQuery, 'GET')
        .then(function(data){
            if(data.status === "OK") {
                let totalLength = data.response.docs.length;
                let articleArr = data.response.docs;
                if(document.getElementById('ny-times-container').innerText.length !== 0) {
                    document.getElementById('ny-times-container').innerHTML = '';
                    for(let i=0; i<totalLength; i++) {
                        document.getElementById('ny-times-container').innerHTML += `<div class="article-links"><a target="blank" href="${articleArr[i].web_url}">${articleArr[i].snippet}</a></div>`;
                    }
                } else {
                    for(let i=0; i<totalLength; i++) {
                        document.getElementById('ny-times-container').innerHTML += `<div class="article-links"><a target="blank" href="${articleArr[i].web_url}">${articleArr[i].snippet}</a></div>`;
                    }
                }
                
            }
        })
        .catch(function(error){
            document.getElementById('ny-times-container').innerHTML = `Couldn't load New York Times articles. Please Try again.`;
        })
    }
}

/**
 * 
 * @param {string} query - query, as name says is a string that's 
 * read from input field. 
 * @param {string} method - method is string specified to HTTP 
 * method, like 'GET', 'POST' etc.
 * 
 * This function utilizes the native "XMLHttpRequest()" function 
 * to read data from Wikipedia REST API and then responds to ES6 
 * promise's "resolve()" or "reject()" method. I also used HEROKU 
 * CORS server as Wikipedia REST API doesn't allow to fetch data 
 * from other domain names due to security reasons.
 */
function getWikiData(query, method) {
return new Promise(function(resolve, reject){
    let xhr = new XMLHttpRequest();
    xhr.open(method, `https://cors-anywhere.herokuapp.com/https://en.wikipedia.org/w/api.php?action=opensearch&format=json&redirects=return&search=${query}`);
    xhr.send();
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4 && xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            resolve(response);
        }
    }
    xhr.onerror = function(){
        reject(xhr.statusText);
    }
});
} 


/**
 * 
 * @param {string} query - query, as name says is a string that's 
 * read from input field. 
 * @param {string} method - method is string specified to HTTP 
 * method, like 'GET', 'POST' etc.
 * 
 * This function also takes a query parameter and an HTTP method and
 * then returns an ES6 based native promise that resolve the response 
 * if the request is successful and response is arrived and also handle
 * the situation in which request is not successful.
 * 
 * Note that I didn't use CORS server in this case because New York Times
 * API does not requires the request to be from same origin. 
 */
function getNYTData(query, method) {
    return new Promise(function(resolve, reject){
        let xhr = new XMLHttpRequest();
        xhr.open(method, `http://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=8eb8a97e3a044de39734861499c611a1&q=${query}`);
        xhr.send();
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4 && xhr.status === 200) {
                let response = JSON.parse(xhr.responseText);
                resolve(response);
            }
        }
        xhr.onerror = function(){
            reject(xhr.statusText);
        }
    });
}