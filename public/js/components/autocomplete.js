import axios from "axios";

require("jquery-ui/ui/widgets/autocomplete");

let userCache = {};

$(".user_autocomplete").autocomplete({
  minLength: 2,
  source: function(request, response) {
    var term = request.term;

    if (term in userCache) return response(userCache[term]);

    axios
      .get("/action/user-autocomplete", { params: request })
      .then(results => {
        response(results.data);
      });
  },
  appendTo: ".user_autocomplete_result",
  select: function(event, ui) {
    const email = ui.item.label;
    axios.get("/action/get-user", { params: { email } }).then(results => {
      $('.list_item_wrap').hide();
      $('.search_results').html(results.data).show();
    });
  }
});
