import Vue from "vue/dist/vue.js";
import $ from "jquery";
import axios from "axios";
import submitAjaxForm from "../methods/ajaxForm";
import { imageCropper, multipleInit } from "../components/imageCropper";
import deleteAjax from "../methods/deleteAjax";

if (document.getElementById("company_form")) {
  let description_lang = [];

  $('input[v-model="description_lang"]').each(function() {
    if (this.checked) description_lang.push(this.value);
  });

  let userInTeam = +$('input[v-model="userInTeam"]').val();

  let activePart = location.hash.substr(1);

  let companyForm = new Vue({
    el: "#company_form",
    data: {
      description_lang,
      addMe: true,
      userInTeam,
      activePart: activePart || "info"
    },
    methods: {
      imageCropper: event => {
        imageCropper(event.target);
      },
      submit: event => {
        event.target.form.submit();
      },
      ajaxSubmit: event => {
        submitAjaxForm(event.target.form);
      },
      deleteMember: (companyId, memberId) => {
        let $block = $(event.target).closest(".item");
        deleteAjax(
          `/action/deleteMember?companyId=${companyId}&memberId=${memberId}`
        ).then(() => {
          $block.remove();
        });
      }
    },
    mounted: () => {
      $(".choosen_select").chosen();
      $(".selectized").selectize({
        options: [],
        create: true,
        delimiter: ",",
        valueField: "name",
        labelField: "name",
        searchField: "name",
        load: function(query, callback) {
          $.ajax({
            method: "get",
            url: `/api/tags/?q=${query}`,
            success: res => {
              callback(res);
            }
          });
        }
      });
    },
    created: () => {
      $("#company_form").css("opacity", 1);
    }
  });

  $(window).on("hashchange", function(e) {
    companyForm.activePart = location.hash.substr(1) || "info";
  });
}
