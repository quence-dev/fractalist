const topBtn = document.getElementById("topBtn");
const about = document.getElementById("aboutLink");
const documentation = document.getElementById("documentationLink");
const credits = document.getElementById("creditsLink");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    let intViewportHeight = window.innerHeight;
    let position = window.scrollTop();

    if (document.body.scrollTop > (intViewportHeight / 2) || document.documentElement.scrollTop > (intViewportHeight / 2)) {
      topBtn.style.display = "block";
    } else {
      topBtn.style.display = "none";
    }

    $('.section').each(function() {
      var target = $(this).offset().top;
      var id = $(this).attr('id');

      if (position >= target) {
        $('#navigation > ul > li > a').removeClass('active');
        $('#navigation > ul > li > a[href=\\#' + id + ']').addClass('active');
      }
    });
  }

  // When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}






//   Scroll to Top: https://www.w3schools.com/howto/howto_js_scroll_to_top.asp