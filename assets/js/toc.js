var toc = $("#markdown-toc");
var absoluteY = toc.offset().top;

$(window).scroll(function (event) {
    var scroll = $(window).scrollTop();
    var fixedY = 20;
    if (scroll >= absoluteY - fixedY && $(window).width() >= 1450) {
      toc.addClass('markdown-toc-fixed')
    } else {
      toc.removeClass('markdown-toc-fixed')
    }
});

$("#markdown-toc a").click(function() {
  $("html, body").animate({
    scrollTop: $($(this).attr("href")).offset().top + "px"
  }, {
    duration: 600,
    easing: "swing"
  });
  return false;
});
