const teamList = ({obj, locale}) => {
  let members = `<div class="list_item_wrap list_members">`;
  const team = obj.members;
  team.forEach(el => {
    let ava = el.image ? `/uploads${el.image}` : '/uploads/default/profile.svg'
    members += `
      <div class="item flx jcsb aic">
        <div class="flx aic">
          <img class="ava" src="${ava}">
          ${el.email}
          ${el.confirmed ? 'confirmed' : 'not confirmed'}
        </div>
        <div class="control">
          <a href="/${locale}/profile/company/startup/update/${obj.id}/member/${el.id}"><img src="/img/pencil.svg" width="24" /></a>
          <span v-on:click="deleteMember('${obj.id}','${el.id}')"><img width="24" src="/img/delete.svg" /></span>
        </div>
      </div>`;
  });
  members += `</div>`
  return members;
};

module.exports = { teamList };
