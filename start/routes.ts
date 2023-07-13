import Route from "@ioc:Adonis/Core/Route";

Route.post("/login", "AuthController.login").as("login");
Route.group(() => {
  Route.post("/logout", "AuthController.logout").as("logout");

  //Route Admin Management Member
  Route.get("/members", "Admin/members/MembersController.getMembers").as(
    "Getmembers"
  );
  Route.post("/members", "Admin/members/MembersController.storeMember").as(
    "Createmember"
  );
  Route.get("/members/:id", "Admin/members/MembersController.detailMember").as(
    "Detailmember"
  );
  Route.put("/members/:id", "Admin/members/MembersController.updateMember").as(
    "Updatemember"
  );
  Route.delete(
    "/members/:id",
    "Admin/members/MembersController.deleteMember"
  ).as("Deletemember");
})
  .prefix("/api")
  .middleware("auth");
