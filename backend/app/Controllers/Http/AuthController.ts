import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import Hash from "@ioc:Adonis/Core/Hash";

export default class AuthController {
  public async register({ auth, request, response }: HttpContextContract) {
    const data = request.only(["username", "email", "password"]);

    try {
      const user = await User.create(data);
      const token = await auth.use("api").login(user);
      return response.ok(token);
    } catch (error) {
      console.error("Error creating user:", error);
      return response.badRequest("Error creating user");
    }
  }

  public async login({ request, auth, response }: HttpContextContract) {
    const email = request.input("email");
    const password = request.input("password");

    try {
      const user = await User.query().where("email", email).firstOrFail();
      if (!(await Hash.verify(user.password, password))) {
        return response.unauthorized("Invalid credentials");
      }

      const token = await auth.use("api").login(user);
      return response.ok(token);
    } catch (error) {
      console.error("Error logging in user:", error);
      return response.unauthorized("Invalid credentials");
    }
  }
}
