const setIframeHeight = () => {
  $(".auto_iframe").each(function() {
    $(this).css("height", 0.56 * $(this).width() + "px");
  });
};

export default setIframeHeight;
