import locales from "../../../data/locales";
import vocabulary from "../methods/vocabulary";

const generateName = index => {
  let text = lang => `<div class="form-group">    
	  	<label>Gallery_name ${lang}</label>
		<input type="text" class="content_position_index" name="floatContent[${index}][name][${lang}]">
  </div>`;

  let block = "";

  locales.forEach(el => {
    block += text(el);
  });

  return block;
};

export default index => {
  return `${generateName(index)}
	 <div class="form-group form-group-image-pick">
		 <label>Gallery_image</label>
		 <input class="image_pick_multiple" data-id="${index}" type="file" accept="image/" multiple>
     <div class="images_box">
      <div class="add_gallery_image"></div>
     </div>
	 </div>`;
};
