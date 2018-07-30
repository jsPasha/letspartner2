import locales from "../../../data/locales";
import vocabulary from "../methods/vocabulary";

export default index => {

  let text = lang => `<div class="form-group">
  	<label>Text ${lang}</label>
  	<textarea class="ckeditor_item content_position_index dynamic_editor" name="floatContent[${index}][text][${lang}]" rows="6"></textarea>
  </div>`;

  let block = "";

  locales.forEach((el) => {
  	block += text(el);
	});
	
	return block;
	
};
