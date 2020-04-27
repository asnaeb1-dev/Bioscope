/**
 * This file connects to the firebase cloud storage in order to upload files.
 * This file looks up for the movie in the OMDB database and prepares the upload for the admin
 */

//FIREBASE CONNECTIVITY

var movie_obj = {};

var firebaseConfig = {
    apiKey: "AIzaSyC6hIDmXIMwQHDxS8bqgVDO49178Rp5AOU",
    authDomain: "bioscope-6d934.firebaseapp.com",
    databaseURL: "https://bioscope-6d934.firebaseio.com",
    projectId: "bioscope-6d934",
    storageBucket: "bioscope-6d934.appspot.com",
    messagingSenderId: "253621047295",
    appId: "1:253621047295:web:0b96de0ad0f876db0261ca",
    measurementId: "G-8RR2NZKB2V"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

firebase.analytics();

//ui access
const search_form = document.querySelector('form');
const choose_file = document.querySelector('#choose-file');
const push_button = document.querySelector('#push');
const progressBar = document.querySelector('#progress');
push_button.setAttribute('disabled', 'disabled')


search_form.addEventListener('submit', (event) => {
    event.preventDefault();
    getMovie(event.target.search.value);
    console.log(movie_obj)
});

choose_file.addEventListener('change', (event) => {
    //upload file
    uploadFile(event.target.files[0]);
})

push_button.addEventListener('click', (event) => {
    console.log(movie_obj)
    pushMovie(movie_obj);
})


const getMovie = (query) => {
    const baseURL = 'http://localhost:3000';
    fetch(`${baseURL}/movie/search?q=${query}`)
        .then(response => response.json())
        .then(result =>{
            movie_obj.title = result.Title,
            movie_obj.description = result.Plot,
            movie_obj.year = result.Year,
            movie_obj.rating= result.imdbRating,
            movie_obj.language = result.Language,
            movie_obj.genres = result.Genre,
            movie_obj.director = result.Director,
            movie_obj.actors = result.Actors
        })
        .catch(err => console.log(err))
}

const uploadFile = (fileName) => {
    //make firebase reference
    let ref = firebase.storage().ref('movie/'+fileName.name)
    let uploadTask = ref.put(fileName)
    
    //upload task
    uploadTask.on('state_changed', function progress(snapshot){
        let percent = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
        progressBar.value = percent
    }, function error(err){
        console.log(err);
    }, function complete(){
        uploadTask.snapshot.ref.getDownloadURL().then(url =>{ 
            movie_obj.url = url
            push_button.removeAttribute('disabled');
        }).catch(e => console.log(e));
    })
}

const pushMovie = (movie) => {
    fetch('http://localhost:3000/movie/push', {
        method: "POST",
        body: JSON.stringify(movie),
        headers: { 
            "Content-type": "application/json"
        }
    }).then(response => response.json())
    .then(json => console.log(json))
    .catch(e => console.log(e))
}
