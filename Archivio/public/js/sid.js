$(window).on('resize',function() {
 
 
  // apertura sidebar
  $( ".open" ).click(function() {
    // chiusura-cambio della classe del bottone di apertura-chiusura
    $(this).fadeOut();
    $(".closed").fadeIn();
    $("aside").addClass("large");
    // ingresso sidebar
    $( "aside" ).slideDown( "slow", function() {
     // calcolo variabili elementi
     var p = $( ".large" );
     var offset = p.offset();
     var g = $( "section.wrapper" );
     var t = g.outerWidth( true ) - g.outerWidth();
     var Xsize = g.outerWidth();
     var sideHeight = window.innerHeight - offset.top;
     // altezza colonna
     $( ".large" ).css("height", sideHeight + 40 + "px");
     // dimensioni condizionali dei pannelli
     if ($(window).width() < 1140) {
       $( ".floated" ).css("width", Xsize - 360 + "px");
     }
     else if (($(window).width() > 1140) &&  ($(window).width() < 1780)) {
       $( ".floated" ).css("width", offset.left - (t/2) - 1 + "px");
     }
     else if ($(window).width() > 1780) {
       $( ".floated" ).css("width", 1026 + "px");
     }
     else{  
     }
    });
  });
  
  // chiusura sidebar
  $( ".closed" ).click(function() {
    // chiusura-cambio della classe del bottone di apertura-chiusura
    $(this).fadeOut();
    $(".open").fadeIn();
    // uscita sidebar
    $( "aside" ).slideUp( "slow", function() {
     $("aside").removeClass("large");
     // reset dimensioni condizionali dei pannelli
     if ($(window).width() < 1140) {
       $( ".floated" ).css("width", 100 + "%");
     }
     else if (($(window).width() > 1140) &&  ($(window).width() < 1780)) {
       $( ".floated" ).css("width", 100 + "%");
     }
     else if ($(window).width() > 1780) {
       $( ".floated" ).css("width", 1026 + "px");
     }
     else{  
     }
    });
  });
  
}).trigger('resize');