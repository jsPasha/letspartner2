const usersList = ({ users, user, locale }) => {
  let list = "";
  for (var i = 0; i < users.length; i++) {
    list += `<div class="item flx jcsb aic">
			<div class="user_info">
				Mail: <b>${users[i].email}</b><br>
				Role: <b ${ users[i].role === 'admin' ? 'style="color: #ee6e73"': ''}>${users[i].role}</b><br>
				Activation: <b>${users[i].active ? "activated" : "not activated"}</b><br>
				${users[i].active ? "Activation date - " : "Registration date - "}<b>${
      users[i].moment
    }</b>
			</div>`;

    if (users[i].email === user.email) {
      list += `<span>It's me!</span>`;
    } else {
      list += `<div class="control">
						<p>
							<label>
								<input type="checkbox" class="state_checkbox" data-state="blocked" data-model="user" data-id="${
                  users[i].id
                }" ${users[i].blocked ? 'checked=""' : ""}>
								<span>${"Block user"}</span>
							</label>
						</p>
						<a href="/${locale}/admin/users/update/${
        users[i].id
      }"><img src="/img/pencil.svg" alt=""></a>
				</div>`;
    }
    list += "</div>";
  }
  return list;
};

module.exports = usersList
