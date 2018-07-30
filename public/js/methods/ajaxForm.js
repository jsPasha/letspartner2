import $ from "jquery";

const submitAjaxForm = form => {
  return new Promise((res, rej) => {
    const method = $(form).attr("method"),
      url = $(form).attr("action"),
      data = $(form).serialize();
    $.ajax({
      method,
      url,
      data,
      success: data => {
        res(data);
        $("body").append(`
        <div class="success_fixed">
         ${data.text}
        </div>
      `);
        setTimeout(() => {
          $(".success_fixed").remove();
        }, 2000);
      },
      error: rej
    });
  });
};

export default submitAjaxForm;
