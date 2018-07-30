import $ from "jquery";

export default () => {
  $(".constructor_item").each(function(el) {
    const index = $(this).index();
    let contentInput = $(this).find(".content_type_input");
    let contentPositionIndexInputs = $(this).find(".content_position_index");

    let name = contentInput.attr("name");
    let newName = name.replaceAt(13, `${index}`);
    contentInput.attr("name", newName);

    contentPositionIndexInputs.each(function() {
      let name = $(this).attr("name");
      let newName = name.replaceAt(13, `${index}`);
      $(this).attr("name", newName);
    });
  });
};

String.prototype.replaceAt = function(index, replacement) {
  return (
    this.substr(0, index) +
    replacement +
    this.substr(index + replacement.length)
  );
};
