$(document).ready(function(){
  // Change this to the correct selector.
  $("#part-0").css("min-height",$(window).height() - 79);
  robotics.init();
  robotics.show();

  $( window ).resize(function() {
    $("#part-0").css("min-height",$(window).height() - 79);
  });
});

$(".main-header-1").fitText();

var clip_index = 0;
var clip_elem = "";
var clips = ["#cell-robot","#cell-data","#cell-chem","#cell-energy"];
var in_progress = false;
var wait_per = 0;

set_interval();

function set_interval(){
  //clears the interval
  window.setInterval(function(){
    clip_index++;
    if(clip_index === clips.length){
      clip_index = 0;
    }

    clip(clips[clip_index]);
  }, 3000);

  window.setInterval(function(){
    wait_per += 50;
    var _per = 100 * (wait_per / 1000);
    $("#bar span").css("width", (_per + "%"));
  }, 50);
}


function clip(elem){
  if(in_progress === false && elem !== clip_elem){
    clip_elem = elem;
    in_progress = true;
    //
    //

    /*
    var id = "#btn_" + elem.replace("#cell-","");
    $(".fa-circle-o").removeClass("fa-circle-o").addClass("fa-circle");
    $(id).removeClass("fa-circle").addClass("fa-circle-o");
    */

    //
    //


    clip_index = clips.indexOf(elem);

    var left = Math.floor($(elem).width() /2);
    var right = ($(elem).width() - left);
    var height = $(elem).height();
    var width = $(elem).width();

    /*
    y1, x2, y2, x1
    */


    $("#part-0 > div").each(function(index){
      if($(this).css("display") !== "none"){
        $(this).css("z-index","1");
        $(this).addClass("will-remove");
      }
    });

    $(elem).css("z-index","2");
    $(elem).css("display","flex");


    var slope = 0.5;

    /*
    start:
            13---24

        1 = (left-100,0)
        2 = (left+100,0)
        3 = (left-100,0)
        4 = (left+100,0)

    down:
         1___2
        /   /
       /   /
     3/___/4


      1 = (left - 100, 0)
      2 = (left + 100, 0)
      3 = ((left-100) - height/2,height) *change
      4 = ((left+100) - height/2,height) *change


      out

                1________________2
              /                 /
            /                 /
          /                 /
        /3________________/4

        1 = (0,0)
        2 = (width + height/2 ,0)
        3 = (0 - height/2,height)
        4 = (width, height)

    */

    $(elem).css("-webkit-clip-path",generate(left-100,0,left+100,0,left-100,0,left+100,0));
    $(elem).css("-moz-clip-path",generate(left-100,0,left+100,0,left-100,0,left+100,0));
    $(elem).css("clip-path",generate(left-100,0,left+100,0,left-100,0,left+100,0));

    var x1 = left-100;
    var y1 = 0;
    var x2 = left+100;
    var y2 = 0;
    var x3 = left-100;
    var y3 = 0;
    var x4 = left+100;
    var y4 = 0;

    var out = height*slope;


    var per = 0;
    var interval = window.setInterval(function(){
      per+=2;
      if(per <= 50){
        var percent = (per * 2) / 100;

        y3 = percent*height;
        y4 = percent*height;

        x3 = (left-100) - percent*out;
        x4 = (left+100) - percent*out;

        $(elem).css("clip-path",generate(x1,y2,x2,y2,x3,y3,x4,y4));
        $(elem).css("-webkit-clip-path",generate(x1,y2,x2,y2,x3,y3,x4,y4));
        $(elem).css("-moz-clip-path",generate(x1,y2,x2,y2,x3,y3,x4,y4));

      }
      else{
        var percent = ((per - 50) * 2 ) / 100;

        //  init  final init
        x1 = (left-100) + ((0) - (left-100))*percent;
        x2 = (left+100) + ((width + out) - (left+100))*percent;
        x3 = ((left-100) - out) + ((0 - out) - ((left-100) - out))*percent;
        x4 = ((left+100) - out) + ((width) - ((left+100) - out))*percent;

        $(elem).css("clip-path",generate(x1,y2,x2,y2,x3,y3,x4,y4));
        $(elem).css("-webkit-clip-path",generate(x1,y2,x2,y2,x3,y3,x4,y4));
        $(elem).css("-moz-clip-path",generate(x1,y2,x2,y2,x3,y3,x4,y4));

        if(per === 100){
          clearInterval(interval);

          in_progress = false;

          $(elem).css("clip-path", "none");
          $(elem).css("-webkit-clip-path", "none");
          $(elem).css("-moz-clip-path", "none");

          $(".will-remove").css("display","none");
          $(".will-remove").removeClass("will-remove");

          $("#bar span").css("width","0");
          wait_per = 0;

          if(elem === "#cell-robot" && robotics.done === false){
            robotics.show();
          }
        }
      }
    }, 20);

    /*
    clipTop
    clipBottom
    clipRight
    clipLeft
    */

    //once done, clip-path = none
  }
}

var side_open = false;
var is_mobile = false;

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 	is_mobile = true;
}

if(is_mobile){

}

function generate(x1, y1, x2, y2, x3, y3, x4, y4){
  return "polygon(" + x1 + "px " + y1 + "px," + x2 + "px " + y2 + "px," + x4 + "px " + y4 + "px," + x3 + "px " + y3 + "px)";
}
