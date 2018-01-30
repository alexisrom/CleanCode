let role = "Admin";
let color;
const roles = [{ name: "Admin", color: 1 }];

switch (role) {
  case "Admin":
    color = 1;
    break;
  case "User":
    color = 2;
    break;
}

color = roles.find(r => (r.name = role)).color;
