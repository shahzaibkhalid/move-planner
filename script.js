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