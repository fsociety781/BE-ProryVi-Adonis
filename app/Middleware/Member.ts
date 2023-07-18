import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class Role {
  public async handle(
    { response, auth }: HttpContextContract,
    next: () => Promise<void>
  ) {
    try {
      await auth.check();
      const user = await User.find(auth.user?.id);
      const member = user?.role === "member";
      if (!member) {
        return response.status(403).json({
          Status: "403",
          message: "Access Denied! Access Member only.",
        });
      }
      await next();
    } catch {
      return response.status(401).json({
        message: "Please login first.",
      });
    }
  }
}
