import $ from "jquery";

const loader = {
  show: () => {
    $("body").append(`<div id="fixed_preloader" class="fixed-preloader">
		<img src="/img/loader.svg" />
	 </div>`);
  },
  hide: () => {
    $("#fixed_preloader").remove();
  }
};

export default loader;
