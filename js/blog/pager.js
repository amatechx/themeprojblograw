/*
 * Blog Pager Functionality - Heather Free Version Theme
 * Previous/Next post pagination with thumbnails
 */

// Pager functionality for previous/next posts
$(function(){
    var newerLink = $('a.newer-link');
    var olderLink = $('a.older-link');

    $.get(newerLink.attr('href'), function (data) {
        var thumb = $(data).find('.post-entry img:first').length >= 1 ? "<img src='" + $(data).find('.post-entry img:first').attr('src').replace(/s\B\d{2,4}/,'s' + 180) + "' class='pager-thumb'/>" : "";
        newerLink.html(thumb + '<div><strong>Next</strong> <span>' + $(data).find('.post .entry-title').text() + '</span></div>');
    },"html");

    $.get(olderLink.attr('href'), function (data2) {
        var thumb2 = $(data2).find('.post-entry img:first').length >= 1 ? "<img src='" + $(data2).find('.post-entry img:first').attr('src').replace(/s\B\d{2,4}/,'s' + 180) + "' class='pager-thumb'/>" : "";
        olderLink.html(thumb2 + '<div><strong>Previous</strong> <span>' + $(data2).find('.post .entry-title').text() + '</span></div>');
    },"html");
});