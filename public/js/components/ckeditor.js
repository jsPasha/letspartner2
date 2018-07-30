import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function initCkeditors(opt) {
  let { items, callback } = opt;
  var cke = document.getElementsByClassName(items);
  [].forEach.call(cke, function(el) {
    ClassicEditor.create(el, {
      removePlugins: ["Heading", "italic"],
      toolbar: ["bold", "link", "bulletedList", "numberedList", "blockQuote"],
      plugins: ClassicEditor.build.plugins.concat([cancelDropEvents])
    }).then(editor => {
			el.editor = editor;
			callback(el)
		});
  });
}

function cancelDropEvents(editor) {
  // High priority means that the callbacks below will be called before other CKEditor's plugins.

  editor.editing.view.document.on(
    "drop",
    (evt, data) => {
      // Stop execute next callbacks.
      evt.stop();

      // Stop the default event action.
      data.preventDefault();
    },
    { priority: "high" }
  );

  editor.editing.view.document.on(
    "dragover",
    (evt, data) => {
      evt.stop();
      data.preventDefault();
    },
    { priority: "high" }
  );
}
