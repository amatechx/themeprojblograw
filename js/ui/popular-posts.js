/*
 * Popular Posts Functionality - Heather Free Version Theme
 * Image resizing and popular posts enhancements
 */

$(document).ready(function() {
    // change the dimension variable below to be the pixel size you want
    var dimension = 300;
    // this identifies the PopularPosts1 div element, finds each image in it, and resizes it
    $('.PopularPosts').find('img').each(function(n, image){
        var image = $(image);
        image.attr({src : image.attr('src').replace(/s\B\d{2,4}/,'s' + dimension)});
        image.attr('width',dimension);
        image.attr('height',dimension);
    });
});