import Route from "@ioc:Adonis/Core/Route";

Route.post("/login", "AuthController.login");
Route.group(() => {
  Route.post("/logout", "AuthController.logout");

  //Route Admin
  //Route Admin Management Member
  Route.get("/members", "Admin/members/MembersController.getMembers");
})
  .prefix("/api")
  .middleware("auth");
