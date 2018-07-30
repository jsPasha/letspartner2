const locales = require('../../../data/locales')

const newsList = ({ news, locale }) => {
    let list = "";
    for (let i = 0; i < news.length; i++) {
        list += `<div class="item">
        <a href="/${locale}/news/page/${news[i].createdAt}/${news[i].alias}">                    
        <img src="/uploads${news[i].images.thumbNewsImage || news[i].images.mainNewsImage || '/default/news.png'}" alt="">
        <h3>${news[i].name[locale] || news[i].name[locales[0]]}</h3>
        <span>${news[i].moment}</span>
        </a>
        </div>`;
    }
    return list;
};

module.exports = newsList;
