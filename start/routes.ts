import Route from "@ioc:Adonis/Core/Route";

Route.post("/login", "AuthController.login").as("login");
Route.post("/logout", "AuthController.logout").as("logout").middleware("auth");

Route.group(() => {
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

  //Route untuk management Procurement
  Route.get(
    "/admin/procurement",
    "Admin/procurements/ProcurementsController.getItem"
  ).as("GetAllItems");

  Route.patch(
    "/admin/procurement/:id",
    "Admin/procurements/ProcurementsController.updateItem"
  ).as("updateItem");

  Route.get(
    "/admin/procurement/:id",
    "Admin/procurements/ProcurementsController.getDetailItem"
  ).as("getDetailItems");
})
  .prefix("/api")
  .middleware("auth")
  .middleware("admin");
