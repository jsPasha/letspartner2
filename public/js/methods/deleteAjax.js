import $ from "jquery";

const deleteAjax = link => {
  return new Promise((res, rej) => {
    const url = typeof link === "string" ? link : link.getAttribute("href");
    $.ajax({
      method: "get",
      url,
      success: data => {
        $("body").append(`
        <div class="${data.type}_fixed">
         ${data.text}
        </div>
      `);
        setTimeout(() => {
          $(`.${data.type}_fixed`).remove();
        }, 2000);
        res();
      },
      error: rej
    });
  });
};

export default deleteAjax;
