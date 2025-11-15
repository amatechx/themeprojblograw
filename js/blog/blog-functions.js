/*
 * Blog Functions - Heather Free Version Theme
 * Functions for blog posting, summary generation, and related posts
 */

var classicMode = false;
var summary = 20;
var indent = 3;
var imgr = new Array();
imgr[0] = "https://3.bp.blogspot.com/-ltyYh4ysBHI/U04MKlHc6pI/AAAAAAAADQo/PFxXaGZu9PQ/w200-h140-c/no-image.png";
var showRandomImg = true;
var aBold = true;
var summaryPost = 170;
var summaryTitle = 25;
var numposts1 = 6;
var numposts2 = 8;
var classicMode = false;
var summary = 50;
var indent = 3;
var relatedTitles = new Array();
var relatedTitlesNum = 0;
var relatedUrls = new Array();
var thumburl = new Array();

function stripHtmlTags(s, max) {
    return s.replace(/<.*?>/ig, '').split(/\s+/).slice(0, max - 1).join(' ');
}

function createSummaryAndThumb(pID, title, url, date, comment, author, tag, authurl) {
    var posturl = url;
    var authorurl = authurl;
    var title = title;
    var date = date;
    var comment = comment;
    var tag = tag;
    var div = document.getElementById(pID);

    var img = div.getElementsByTagName("img");

    var content1 = div.innerHTML.replace(/<img.*?>/ig, '').replace(/<iframe.*?>/ig, '');
    var arr = content1.split(/<br\s*\/?>/);
    var content = arr[0] + arr.slice(1, -1).join('<br>') + arr.slice(-1);

    var month = new Array();
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Aug";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";
    var n = month[date.split('/')[0]];
    var date1 = date.split('/')[1];
    var year = date.split('/')[2];

    if (img.length >= 1) {
        var imgurl = img[0].src;
        var thumb = '<div class="post-image"><a href="' + posturl + '"><img class="thumb" width="940" height="987" src="' + imgurl + '"></a></div>';
        var summary1 = thumb + '<div class="embedd"><header class="post-header"><div class="labelhome">' + tag + '</div><h2 class="entry-title"><a href=' + posturl + '>' + title + '</a></h2></header><div class="entry-content clear"><div class="intro-text">' + stripHtmlTags(content, 30) + '...</div></div><div class="cen clearfix"><span class="post-da">' + date + '</span></div></div>';
    } else {
        var frame = div.getElementsByTagName("iframe");
        if (frame.length >= 1) {
            var iframe1 = frame[0].src;
            var thumb = '<div class="post-image"><iframe width="100%" height="450" frameborder="no" src="' + iframe1 + '" scrolling="no"></iframe></div>';
            var summary1 = thumb + '<div class="embedd"><header class="post-header"><div class="labelhome">' + tag + '</div><h2 class="entry-title"><a href=' + posturl + '>' + title + '</a></h2></header><div class="entry-content clear"><div class="intro-text">' + stripHtmlTags(content, 30) + '...</div></div><div class="cen clearfix"><span class="post-da">' + date + '</span></div></div>';
        } else {
            var summary1 = '<div class="embedd"><header class="post-header"><div class="labelhome">' + tag + '</div><h2 class="entry-title"><a href=' + posturl + '>' + title + '</a></h2></header><div class="entry-content clear"><div class="intro-text">' + stripHtmlTags(content, 30) + '...</div></div><div class="cen clearfix"> <span class="post-da">' + date + '</span></div></div>';
        }
    }

    div.innerHTML = summary1;
    div.style.display = "block";
    var elem = document.getElementsByClassName("separator");
    for (var i = 0; i < elem.length; i++) {
        elem[i].innerHTML = '';
    }
}

function removeHtmlTag(strx, chop) {
    var s = strx.split("<");
    for (var i = 0; i < s.length; i++) {
        if (s[i].indexOf(">") != -1) {
            s[i] = s[i].substring(s[i].indexOf(">") + 1, s[i].length);
        }
    }
    s = s.join("");
    s = s.substring(0, chop - 1);
    return s;
}

function stripHtmlTags(s, max) {
    return s.replace(/<.*?>/ig, '').split(/\s+/).slice(0, max - 1).join(' ');
}

var currentposturl = "<data:post.url/>";
var maxresults = 3;
var relatedpoststitle = "<b/>";
removeRelatedDuplicates_thumbs();
printRelatedLabels_thumbs();