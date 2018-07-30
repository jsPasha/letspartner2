import $ from "jquery";

const setState = (data) => {
  const url = `/action/set-state/`;
  $.ajax({
    type: "POST",
    url,
    data,
    success: () => console.log("ok"),
    error: error => console.log(value)
  });
};

export default setState;
