
$(document).ready(function() {
    // api key and url to fetch data
    const key = 'AIzaSyBB9e8PqaiklMPwOopYmCFVq8bhSv5k3qY';
    const URL = 'https://www.googleapis.com/youtube/v3/videos';
    
    // set options to fetch
    const options = {
        part: 'snippet, statistics',
        id: 'TcMBFSGVi1c, z2z857RSfhk, RYID71hYHzg, lc0UehYemQA, JNwNXF9Y6kY, U1fu_sA7XhE',
        key: key,
    }

    // load the videos
    loadVideos();

    // function to load the videos
    function loadVideos() {
        $.getJSON(URL, options, function(data){
            videoLoop(data);
        });
    }

    // set the main video at the top
    function mainVideo(id, titleMain, descriptionMain, viewsMain, likesMain, dislikesMain) {
        $('#video').html(`
            <div id="video-wrapper"><div class="embed-container"><iframe title="${titleMain}" src="https://www.youtube.com/embed/${id}" aria-hidden="true" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></div>
        `);
        $('#main-details').html(`
            <h2>${titleMain}</h2>
            <p>${descriptionMain}</p>
            <ul class="stats">
                <li><i class="far fa-eye" title="number of views"></i> ${viewsMain}</li>
                <li><i class="far fa-thumbs-up" title="number of likes"></i> ${likesMain}</li>
                <li><i class="far fa-thumbs-down" title="number of dislikes"></i> ${dislikesMain}</li>
            </ul>
        `);
    }

    // data for all the videos
    function videoLoop(data) {
        $.each(data.items, function(i, item){
            const thumb = item.snippet.thumbnails.maxres.url;
            const title = item.snippet.title;
            const description = item.snippet.description.substring(0,100);
            const descriptionLong = item.snippet.description;
            const vid = item.id;
            const views = item.statistics.viewCount.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            const likes = item.statistics.likeCount.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            const dislikes = item.statistics.dislikeCount.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            
            $('main').append(`
                <article class="item" data-key="${vid}" data-title="${title}" data-description="${descriptionLong}" data-views="${views}" data-likes="${likes}" data-dislikes="${dislikes}">
                    <div class="wrapper">
                        <div class="thumb">
                            <a class="click"><img src="${thumb}" alt="${title}"></a>
                            <div class="details">
                                <a class="click"><h3>${title}</h3></a>
                                <p>${description}</p>
                                <ul class="stats">
                                    <li><i class="far fa-eye" title="number of views"></i> ${views}</li>
                                    <li><i class="far fa-thumbs-up" title="number of likes"></i> ${likes}</li>
                                    <li><i class="far fa-thumbs-down" title="number of dislikes"></i> ${dislikes}</li>
                                </ul>
                            </div>
                        </div>
                        
                    </div>
                </article>
            `);
        });
    }

    // swap out main video for one user just clicked
    $('main').on('click', 'article a.click', function(){
        const id = $(this).closest('article').attr('data-key');
        const titleMain = $(this).closest('article').attr('data-title');
        const descriptionMain = $(this).closest('article').attr('data-description');
        const viewsMain = $(this).closest('article').attr('data-views');
        const likesMain = $(this).closest('article').attr('data-likes');
        const dislikesMain = $(this).closest('article').attr('data-dislikes');

        mainVideo(id, titleMain, descriptionMain, viewsMain, likesMain, dislikesMain);
        $('html, body').animate({
            scrollTop: $('#video').offset().top
        }, 1000);
    });


    let searchTimer = false;
    $('#search').on('keyup', function() {
        clearTimeout( searchTimer );
        searchTimer = setTimeout(function(){
            // value is what is being typed into the search box
            const value = $('#search').val().toLowerCase();
            // look through the enterty of main article
            $('main article').each(function(){
                const searchText = $(this).data('title').toLowerCase();
                if( searchText.search( value ) !== -1 ) {
                    $(this).show();
                }
                else {
                    $(this).hide();
                }                                                                                        
            });                                       
        }, 250 );
    });
});