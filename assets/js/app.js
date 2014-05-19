
$(document).ready(function(){
      var $body = $("body");

      function animateBg() {
            $backgrounds = $body.data("bg");
            console.log(typeof $backgrounds);

            if (typeof $backgrounds == "object") {
                 $backgrounds.forEach(function(){
                        console.log(key, value);
                 });
            }
      }

      animateBg();
});