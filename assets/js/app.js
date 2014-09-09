
$(document).ready(function(){

      //Cache items
      var $body = $("body"),
          $menu = $(".js-menu"),
          $main = $(".main"),

          //Background Images
          bgObjects = $body.data( 'bg' ),

          //Background Images Total
          bgObjectsTotal = bgObjects.length,

          //Background Images count
          bgObjectsCount = bgObjectsTotal,

          //Initialize menu item to hidden state
          menuActive = false;
          bgObjectsCount = bgObjects.length;

      /*function animateBg() {
            $backgrounds = $body.data("bg");
            console.log(typeof $backgrounds);

            if (typeof $backgrounds == "object") {
                 $backgrounds.forEach(function(){
                        console.log(key, value);
                 });
            }
      }

      animateBg();*/

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
            this.menuTimeline.to(this.$el, 0.6, {width: "100%", z:0, transformOrigin: "50% 100% 10%", backgroundColor: "#000", ease:Quint.easeOut})

            //Make the Link Wrapper Visible
            .to(this.$navElem, 0.1, {autoAlpha: 1, z:0, delay: -1, ease:Expo.easeInOut});

            //Make Link Item visible initially
            this.$navElemLinks.css({opacity: 1});
            //Animate Link items to current position;
            this.menuTimeline.staggerFrom(this.$navElemLinks, 1.2, {scale: 1.8, perspective: "30px", y: this.topTranslate, rotationX: -90, rotationY: -15, rotationZ: -3, z:-300, opacity: 0, ease:Back.easeInOut}, 0.1);
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

      function changeBG() {
          var bg = new TimelineMax();

              bg.to($main, 0.6, {autoAlpha: 0.2, backgroundImage: "url('/assets/img/"+bgObjects[(bgObjectsCount %  bgObjectsTotal)]+"')", ease:Quint.easeOut});

              bgObjectsCount++;
      }

      $carousel = $(".carousel");
      $carousel.owlCarousel({
 
            autoPlay: 5000, //Set AutoPlay to 3 seconds
       
            items : 1,
            itemsDesktop : [1200, 2],
            itemsDesktopSmall : [900,2],
            itemsTablet : [768,1]
       
        });

});