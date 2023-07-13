import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class AuthController {
  public async login({ response, request, auth }: HttpContextContract) {
    const password = await request.input("password");
    const username = await request.input("username");
    try {
      const token = await auth
        .use("api")
        .attempt(username, password, { expiresIn: "1day" });
      const user = await User.findByOrFail("username", username);
      return response.status(200).json({
        status: "200",
        name: user.name,
        token,
      });
    } catch (error) {
      return response.badRequest(error.message);
    }
  }

  public async logout({ response, auth }: HttpContextContract) {
    try {
      await auth.use("api").revoke();
      return response.status(200).json({
        status: "succes",
        message: "Logout Succes",
      });
    } catch (error) {
      return response.badRequest(error.message);
    }
  }
}
