window.$ = window.jQuery = require("jquery");

require("chosen-js");
require("selectize");
require("jquery-validation");
require("owl.carousel");
require('jquery-ui/ui/widgets/datepicker');
require("jquery-lazyload");

import { imageCropper, multipleInit } from "./components/imageCropper";
import initCkeditors from "./components/ckeditor";
import setState from "./methods/state";
import getVideo from "./methods/video";
import axios from "axios";

import React from "react";
import ReactDOM from "react-dom";
import ReactPhoneInput from "react-phone-input-2";

import submitAjaxForm from "./methods/ajaxForm";
import setIframeHeight from "./methods/setIframeHeight";
import newsList from "./templates/news_list";
import Vue from "vue/dist/vue.js";

if (document.getElementById("phone")) {
  ReactDOM.render(
    React.createElement(ReactPhoneInput, {
      defaultCountry: "ua",
      name: "phone",
      value: document.getElementById("phone").dataset.phone
    }),
    document.getElementById("phone")
  );
}

initCkeditors({
  items: "ckeditor_item",
  callback: () => ""
});

require("./components/floatContent");
require("./components/popups");
require("./components/autocomplete");
require("./components/company");
require("./components/languages");
require("./components/lists");

$(".confirm").click(function(e) {
  if (!confirm("Удалить новость?")) e.preventDefault();
});

$(".image_pick").change(function() {
  imageCropper(this);
});

$(document).on("change", ".image_pick_multiple", function() {
  multipleInit(this);
});

$(document).on("keyup change paste", ".video_link", function() {
  getVideo(this);
});

$("body").on("click", ".state_checkbox", function() {
  let { model, id, state } = this.dataset;
  let value = this.checked;
  $(`input[data-id="${id}"]`)
    .not(this)
    .prop("checked", value);
  setState({ model, id, value, state });
});

$(".ajax_form").submit(function(e) {
  e.preventDefault();
  submitAjaxForm(this).then(() => {
    $.magnificPopup.close();
  });
});

$("form").on("change keypress", function() {
  $(this)
    .find('[type="submit"]')
    .show();
});

$(function() {
  $('input[type="submit"]').addClass("active");
});

$(".clear_input").click(function() {
  $(this)
    .siblings("input")
    .val("");
  $(".search_results").hide();
  $(".list_item_wrap").show();
});

$(".static_menu a").click(function(e) {
  e.preventDefault();

  const items = this.getAttribute("data-items");

  $(`a[data-items="${items}"]`).removeClass("active");
  $(this).addClass("active");

  $(items).hide();
  $(this.getAttribute("href")).show();
});

$(".delete_company").click(function(e) {
  e.preventDefault();
  if (confirm("Delete?")) {
    let url = this.getAttribute("href");
    axios.post(url).then(() => location.reload());
  }
});

setTimeout(() => {
  $(".axios-message").remove();
}, 5000);

$(window).scroll(function() {
  if ($(this).scrollTop() > 500) {
    $(".to_top").css("opacity", "1");
  } else {
    $(".to_top").css("opacity", "0");
  }
});

$(".to_top").click(() => {
  $("html, body")
    .stop()
    .animate(
      {
        scrollTop: 0
      },
      500
    );
});

$(".news_carousel").each(function() {
  $(this).owlCarousel({
    items: 1,
    nav: true,
    navText: [
      '<i class="fa fa-arrow-left" aria-hidden="true"></i>',
      '<i class="fa fa-arrow-right" aria-hidden="true"></i>'
    ]
  });
});

setIframeHeight();

$(window).resize(setIframeHeight);

$(".validation").validate();

if (document.getElementById("main_page_news")) {
  $.ajax({
    menthod: "GET",
    url: "/api/main-news",
    cache: false,
    success: data => {
      let { news, locale } = data;
      $("#main_page_news .item_flex").append(newsList({ news, locale }));
    }
  });
}

if (document.getElementById("filter_form")) {
  new Vue({
    el: "#filter_form",
    data: {},
    methods: {
      setName(event, datepick) {
        var el;
        event ? el = event.target : el = datepick.elem;
        if (el.value && !el.hasAttribute("name")) {
          el.setAttribute("name", el.dataset.name);
        } else if (!el.value) {
          el.removeAttribute("name");
        }
        el.form.submit();
      },
      clearForm() {
        $("#filter_form select, #filter_form input").val('').removeAttr('name');
        $("#filter_form").submit()
      }
    },
    mounted() {
      $('.datepicker').datepicker({
        onSelect: (value, event) => {
          this.setName(null, {elem:event.input[0]})
        }
      });
    }
  });
}

$(".lazyload").lazyload();
