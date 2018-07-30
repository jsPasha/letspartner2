const moment = require("moment");

const companiesList = ({ objects, locale }) => {
  let list = `<table class="table">
	<tr>
	<td><b>id</b></td>
	<td><b>Пользователь</b></td>
	<td><b>Тип завки</b></td>
	<td><b>Название компании</b></td>
	<td><b>Статус</b></td>
	<td><b>Created Date</b></td>
	<td><b>Дата публикации / отклонения / ответа партнеру</b></td>
	<td><b>Действие</b></td>
	</tr>`;


  objects.forEach(el => {
    list += `
		<tr>
		<td>${el.id}</td>
		<td>${JSON.parse(el.creator).email}</td>
		<td>${el.type}</td>
		<td>${el.name[locale]}</td>
		<td>${el.status}</td>
		<td>${moment(+el.createdAt).format("LLL")}</td>
		<td>${el.submitedAt ? moment(+el.submitedAt).format("LLL") : ""}</td>
		<td><a href="/${locale}/admin/company/${el.type}/update/${
      el.id
    }"><img width="24" src="/img/pencil.svg" /></a></td>`;
  });

  list += `</table>`;

  return list;
};

module.exports = companiesList;
