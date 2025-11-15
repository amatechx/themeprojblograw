/*
 * Navigation Functionality - Heather Free Version Theme
 * Mobile menu and navigation enhancements
 */

$(function(){
    $('#masthead').slicknav({
        prependTo:'.lefttop'
    });
});

// Scroll to top functionality
$(function(){
    $.fn.scrollToTop = function() {
        $(this).hide().removeAttr("href");

        var scrollDiv = $(this);
        $(window).scroll(function(){
            if ($(window).scrollTop() >= 1000) {
                $(scrollDiv).fadeIn("slow");
            } else {
                $(scrollDiv).fadeOut("slow");
            }

            if ($(window).scrollTop() >= 150) {
                $('.headertop-wrap').addClass('scrolled');
            } else {
                $('.headertop-wrap').removeClass('scrolled');
            }
        });

        $(this).click(function(){
            $("html, body").animate({
                scrollTop: 0
            }, "slow");
        });
    };
});