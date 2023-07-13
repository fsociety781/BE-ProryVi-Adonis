import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import User from "App/Models/User";

export default class extends BaseSeeder {
  public async run() {
    await User.create({
      name: "admin",
      username: "admin",
      email: "4dmin.procurement@gmail.com",
      password: "admin",
      role: "admin",
    });
  }
}
