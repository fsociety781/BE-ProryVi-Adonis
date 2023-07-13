import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class MembersController {
  public async getMembers({ response }: HttpContextContract) {
    try {
      const members = await User.query()
        .where("role", "member")
        .where("isActive", "true")
        .select("name", "username", "email", "nik", "address", "phone");

      if (!members.length) {
        return response.status(404).json({
          status: "404",
          message: "Members Not Founds",
        });
      }
      return response.status(200).json({
        status: "200",
        message: "Success Get Members",
        members: members,
      });
    } catch (error) {
      return response.status(500).json(error.message);
    }
  }
}
