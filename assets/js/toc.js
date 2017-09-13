$(window).scroll(function (event) {
    var scroll = $(window).scrollTop();
    var absoluteY = 636;
    var fixedY = 20;
    if (scroll >= absoluteY - fixedY) {
      $("#markdown-toc").addClass('markdown-toc-fixed')
      console.log(scroll);
    } else {
      $("#markdown-toc").removeClass('markdown-toc-fixed')
    }
});
