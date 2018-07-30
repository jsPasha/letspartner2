import vocabulary from "../methods/vocabulary";

export default index => {
  return `<div class="form-group">
	<label>Video</label>
	<input type="text" class="video_link">
	<input type="hidden" class="content_position_index video_pasted_url" name="floatContent[${index}][video][pastedUrl]">
	<input type="hidden" class="content_position_index video_id" name="floatContent[${index}][video][id]">
	<input type="hidden" class="content_position_index video_api_title" name="floatContent[${index}][video][api][title]">
	<input type="hidden" class="content_position_index video_api_thumbnails" name="floatContent[${index}][video][api][thumbnails]">
</div>`;
};
