import $ from "jquery";
import axios from "axios";

const getVideo = input => {
  let url = input.value;
  const currentVideoId = $(input).attr("data-id");
  const videoId = checkYoutube(url, input);
  if (videoId && currentVideoId !== videoId) {
    $(input)
      .attr("data-id", videoId)
      .siblings(".video_id")
      .val(videoId)
      .siblings(".video_pasted_url")
      .val(url);
    getYoutubeInfo(videoId).then(youtubeInfo => {
      appendVideoInfo(youtubeInfo, input);
    });
  }
};

const checkYoutube = (url, input) => {
  if (url != undefined || url != "") {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
      $(input).removeClass("error");
      return match[2];
    } else {
      $(input).addClass("error");
      console.log("no-youtube");
      return false;
    }
  }
};

const getYoutubeInfo = id => {
  return new Promise((res, rej) => {
    axios
      .get(`/action/youtube-info?id=${id}`)
      .then(response => res(response.data))
      .catch(err => rej(err));
  });
};

const appendVideoInfo = (youtubeInfo, input) => {
  const { title, thumbnails } = youtubeInfo;

  $(input)
    .siblings(".video_api_title")
    .val(title)
    .siblings(".video_api_thumbnails")
    .val(JSON.stringify(thumbnails));

  const thumb = thumbnails.standard || thumbnails.high || thumbnails.medium;
  const thumbUrl = thumb ? thumb.url : "";
  let $videoBlock = $(input).siblings(".video_block");
  if (!$videoBlock.length) {
    $(input).closest(".form-group").append(`<div class="video_block">
      <img src="${thumbUrl}" alt="">
      <h2>${title}</h2>      
    </div>`);
  } else {
    $videoBlock.find("h2").text(title);
    $videoBlock.find("img").attr("src", thumbUrl);
  }
};

export default getVideo;
