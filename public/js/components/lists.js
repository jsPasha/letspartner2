import $ from "jquery";
import submitAjaxForm from "../methods/ajaxForm";
import deleteAjax from "../methods/deleteAjax";

$(".list_add_form").submit(function(e) {
  e.preventDefault();
  submitAjaxForm(this).then(data => {
    const { item } = data;
    this.reset();
    $(".lists_items").append(`
      <li><p>${
        item.name[data.locale]
      }</p><a class="ajax_delete" href="/action/admin/lists/directions/${
      item._id
    }"><img width="20" src="/img/delete.svg" alt=""></a></li>
    `);
  });
});

$("body").on("click", ".ajax_delete", function(e) {
  e.preventDefault();
  deleteAjax(this).then(() => {
    $(this).closest('li').remove();
  });
});
