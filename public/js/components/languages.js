import Vue from "vue/dist/vue.js";
import axios from "axios";

if (document.getElementById("languages_page")) {
  new Vue({
    el: "#languages_page",
    data: {
      constants: []
    },
    methods: {
      submit() {
        const data = $(event.target).serialize();
        $.ajax({
          method: "post",
          url: "/api/languages",
          cache: false,
          data,
          success: data => {
            $("body").append(`
            <div class="success_fixed">
            ${data.text}
            </div>
          `);
            setTimeout(() => {
              $(".success_fixed").remove();
            }, 2000);
          }
        });
      },
      setNameAttr: i => {
        $(`.textarea${i}`).each(function() {
          $(this).attr("name", $(this).attr("data-name"));
        });
      }
    },
    beforeMount: function() {
      axios.get("/api/languages").then(langs => {
        this.constants = langs.data;
      });
    },
    created() {
      console.log("created");
    },
    mounted() {
      console.log("mounted");
    }
  });
}
