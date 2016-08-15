(function($) {

    //custom scroll replacement to allow for interval-based 'polling'
    //rathar than checking on every pixel
    var uniqueCntr = 0;
    $.fn.scrolled = function(waitTime, fn) {
        if (typeof waitTime === 'function') {
            fn = waitTime;
            waitTime = 200;
        }
        var tag = 'scrollTimer' + uniqueCntr++;
        this.scroll(function() {
            var self = $(this);
            var timer = self.data(tag);
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(function() {
                self.removeData(tag);
                fn.call(self[0]);
            }, waitTime);
            self.data(tag, timer);
        });
    };

    $.fn.AniView = function(options) {

        //some default settings. animateThreshold controls the trigger point
        //for animation and is subtracted from the bottom of the viewport.
        var settings = $.extend({
            animateThreshold: 0,
            scrollPollInterval: 20
        }, options);

        //keep the matched elements in a variable for easy reference
        var collection = this;

        //cycle through each matched element and wrap it in a block/div
        //and then proceed to fade out the inner contents of each matched element
        $(collection).each(function(index, element) {
            $(element)
                .addClass("av-container")
                .css('opacity', 0);
        });

        //enable the scrolled event timer to watch for elements coming into the viewport
        //from the bottom. default polling time is 20 ms. This can be changed using
        //'scrollPollInterval' from the user visible options
        $(window).scrolled(settings.scrollPollInterval, function () {
            //cycle through each matched element to make sure any which should be animated into view,
            //are animated on page load rather than needing to wait for initial 'scrolled' event
            $(collection).each(function(index, element) {
                if (
                    $(element).is('[data-av-animation]') &&
                    !$(element).hasClass('av-visible') &&
                    ( // varifiy if entering viewport
                        $(element).offset().top + $(element).scrollTop() <
                        ($(window).scrollTop() + $(window).height() - settings.animateThreshold)
                    )
                ) {
                    $(element)
                        .css('opacity', 1)
                        .addClass('av-visible animated ' + $(element).attr('data-av-animation'));
                }
            });
        });
        $(window).scroll();
    };
})(jQuery);