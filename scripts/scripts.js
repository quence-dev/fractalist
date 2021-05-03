const topBtn = document.getElementById("topBtn");

// When the user scrolls down half of the viewport from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    let intViewportHeight = window.innerHeight;

    if (document.body.scrollTop > (intViewportHeight / 2) || document.documentElement.scrollTop > (intViewportHeight / 2)) {
      topBtn.style.display = "block";
    } else {
      topBtn.style.display = "none";
    }
  }

  // When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}






//   Scroll to Top: https://www.w3schools.com/howto/howto_js_scroll_to_top.asp