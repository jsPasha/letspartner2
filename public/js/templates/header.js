import locales from "../../../data/locales";
import vocabulary from "../methods/vocabulary";

const generateHeader = index => {
  let text = lang => `<div class="form-group">    
	  	<label>Header ${lang}</label>
		<input type="text" class="content_position_index" name="floatContent[${index}][header][${lang}]">
  </div>`;

  let block = "";

  locales.forEach(el => {
    block += text(el);
  });

  return block;
};

export default index => {
  return generateHeader(index);
};