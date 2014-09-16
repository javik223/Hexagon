/**
 * jQuery.Preload
 * http://github.com/htmlhero/jQuery.preload
 *
 * Created by Andrew Motoshin
 * http://htmlhero.ru
 *
 * Version: 1.4.0
 * Requires: jQuery 1.6+
 *
 */

(function($){

    $.preload = (function(sources, part, callback){

        // Plugin cache
        var cache = [];

        // Wrapper for cache
        var caching = function(image){

            for (var i = 0; i < cache.length; i++) {
                if (cache[i].src === image.src) {
                    return cache[i];
                }
            }

            cache.push(image);
            return image;

        };

        // Execute callback
        var exec = function(sources, callback, last){

            if (typeof callback === 'function') {
                callback.call(sources, last);
            }

        };

        // Closure to hide cache
        return function(sources, part, callback){

            // Check input data
            if (typeof sources === 'undefined') {
                return;
            }

            if (typeof sources === 'string') {
                sources = [sources];
            }

            if (arguments.length === 2 && typeof part === 'function') {
                callback = part;
                part = 0;
            }

            // Split to pieces
            var total = sources.length,
                next;

            if (part > 0 && part < total) {

                next = sources.slice(part, total);
                sources = sources.slice(0, part);

                total = sources.length;

            }

            // If sources array is empty
            if (!total) {
                exec(sources, callback, true);
                return;
            }

            // Image loading callback
            var preload = arguments.callee,
                count = 0;

            var loaded = function(){

                count++;

                if (count !== total) {
                    return;
                }

                exec(sources, callback, !next);
                preload(next, part, callback);

            };

            // Loop sources to preload
            var image;

            for (var i = 0; i < sources.length; i++) {

                image = new Image();
                image.src = sources[i];

                image = caching(image);

                if (image.complete) {
                    loaded();
                } else {
                    $(image).on('load error', loaded);
                }

            }

        };

    })();

    // Get URLs from DOM elements
    var getSources = function(items){

        var sources = [],
            reg = new RegExp('url\\([\'"]?([^"\'\)]*)[\'"]?\\)', 'i'),
            bgs, bg, url, i;

        items = items.find('*').add(items);

        items.each(function(){

            bgs = $(this).css('backgroundImage');
            bgs = bgs.split(', ');

            for (i = 0; i < bgs.length; i++) {

                bg = bgs[i];

                if (bg.indexOf('about:blank') !== -1 ||
                    bg.indexOf('data:image') !== -1) {
                    continue;
                }

                url = reg.exec(bg);

                if (url) {
                    sources.push(url[1]);
                }

            }

            if (this.nodeName === 'IMG') {
                sources.push(this.src);
            }

        });

        return sources;

    };

    $.fn.preload = function(callback){

        var items = this,
            sources = getSources(items);

        $.preload(sources, function(){

            if (typeof callback === 'function') {
                callback.call(items.get());
            }

        });

        return this;

    };

})(jQuery);

$(document).ready(function(){

      //Cache items
      var $body = $("body"),
          $menu = $(".js-menu"),
          $main = $(".main"),

          //Initialize menu item to hidden state
          menuActive = false;

      //Navigation menu controls
      var menuControls = {
        $el: '', 
        $navElem: '',
        $navElemLinks: '',
        menuTimeline: '',
        //Initialize menu control
        init: function($el, $nav_elem) {
          //cache elements
          this.$el = $el;
          this.$navElem = $nav_elem;
          this.$navElemLinks = this.$navElem.find('a');
          this.topTranslate = -100;
          //Create new instance of the menu item on an animation timeline
            this.menuTimeline = new TimelineMax({yoyo: true, smoothChildTiming: true, paused: true});

            //Grow Navigation Container to fill browser width
            this.menuTimeline.to(this.$el, 0.6, {width: "100%", z:0, transformOrigin: "50% 100% 10%", backgroundColor: "#000", force3D: true, ease:Quint.easeOut})

            //Make the Link Wrapper Visible
            .to(this.$navElem, 0.1, {autoAlpha: 1, z:0, delay: -1, force3D: true, ease:Expo.easeInOut});

            //Make Link Item visible initially
            this.$navElemLinks.css({opacity: 1});
            //Animate Link items to current position;
            this.menuTimeline.staggerFrom(this.$navElemLinks, 1.2, {scale: 1.8, perspective: "30px", y: this.topTranslate, rotationX: -90, force3D: true, rotationY: -15, rotationZ: -3, z:-300, opacity: 0, ease:Back.easeInOut}, 0.1);
        },
        reveal: function() {
            this.menuTimeline.play();
            //Set menu item to active state
            menuActive = true;


        },
        hide: function(){
          this.menuTimeline.reverse(0.7);

          menuActive = false;
        }
      }

      //Initialize menu controls if menu is present
      if($menu.length > 0) {
            menuControls.init($(".js-nav"), $(".js-nav-links"));
      }

      //

      $menu.on("click", function() {
            if(menuActive == false) {
                menuControls.reveal();
              } else {
                menuControls.hide();
              }
      });

      $carousel = $(".carousel");
      if($carousel.length > 0) {
         $carousel.owlCarousel({
 
            autoPlay: 5000, //Set AutoPlay to 3 seconds
       
            items : 1,
            itemsDesktop : [1200, 2],
            itemsDesktopSmall : [900,2],
            itemsTablet : [768,1]
       
        });
      }


      //Preload Background Images
      //CacheSlider Elements
      $sliderItems = $(".slider_item");
      var  sliderImages = [];

      $sliderItems.each(function(index){
        $this = $(this);

        sliderImages[index] = $this.data("bg");
      });

      //console.log(sliderImages);

      $.preload(sliderImages, function(){
            //Replace the background of each slider with the data attribute
              $sliderItems.each(function(){
                $this = $(this);

                //Change background image to data-bg attribute
                $this.css({backgroundImage: "url('"+ $this.data("bg") +"')"});
              });

            $(".loader").fadeOut();

            $(".slider").homeSlide();
      });

     (function($){
        $.fn.homeSlide = function( options ) {
            
            //Establish our default settings 
            var settings = $.extend({
                items: $(this).find(".slider_item"), //Current child elements of container
            }, options);

            //Total number of slider items
            itemsCount = settings.items.length;

            //Current slider iteration
            itemIndex = 0;

            //Current visible element
            curElem = $(settings.items[itemIndex]);

            ///Initialize Timeline
            t = new TimelineMax({smoothChildTiming: true});


            return this.each(function () {
                var elem =$( this );
                
                //Change Slider element
                timer = setInterval(changeImage, 200);
            });

            function changeImage(){
                clearInterval(timer);

                t.fromTo(curElem, 2, {autoAlpha: 0}, {autoAlpha: 1});

                //Banner text: Text of current visible element
                bannerText = curElem.find(".slider_item_text");

                //Separate banner text into individual letters
                bannerText.lettering();
                bannerTexts = bannerText.find("span");

                t.fromTo(bannerTexts, 1, {autoAlpha: 0}, {autoAlpha: 0.1});

                t.staggerFromTo(bannerTexts, 2, {autoAlpha: 0.1}, {autoAlpha: 0.8, force3D: true}, 0.1);

                t.staggerFromTo(bannerTexts, 2, {autoAlpha: 0.8}, {autoAlpha: 0}, -0.1);
                
                t.to(curElem, 2, {autoAlpha: 0, onComplete: swapZIndex});
                //t.fromTo(curElem, 3, {autoAlpha: 1}, {autoAlpha: 0.01, });
            }

            function swapZIndex(){
               // console.log(itemIndex);

                //updateElemPos(itemIndex);

                if (itemIndex + 1 >= itemsCount) {
                    itemIndex = 0; 
                } else {
                    itemIndex++;
                }

                curElem = $(settings.items[itemIndex]);
                t.set(curElem, {autoAlpha: 0});

                timer = setInterval(changeImage, 200);
            }
      }
     }(jQuery));

      //loadHomeImages();

      //console.log($("body").homeSlide());


});