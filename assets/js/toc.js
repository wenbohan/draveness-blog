var toc = $("#markdown-toc");
var absoluteY = toc.offset().top;

$(window).scroll(function (event) {
    var scroll = $(window).scrollTop();
    var fixedY = 20;
    if (scroll >= absoluteY - fixedY) {
      toc.addClass('markdown-toc-fixed')
    } else {
      toc.removeClass('markdown-toc-fixed')
    }
});
