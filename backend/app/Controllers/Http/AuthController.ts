import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import Hash from "@ioc:Adonis/Core/Hash";
import UserRegisterValidator from "App/Validators/UserRegisterValidator";
import UserLoginValidator from "App/Validators/UserLoginValidator";

export default class AuthController {
  public async register({ auth, request, response }: HttpContextContract) {
    const data = await request.validate(UserRegisterValidator);
    try {
      // Hash password before storing
      const hashedPassword = await Hash.make(data.password);
      const user = await User.create({
        username: data.username,
        email: data.email,
        password: hashedPassword,
      });
      const token = await auth.use("api").login(user);
      return response.ok(token);
    } catch (error) {
      console.error("Error creating user:", error);
      return response.badRequest("Error creating user");
    }
  }

  public async login({ request, auth, response }: HttpContextContract) {
    const data = await request.validate(UserLoginValidator);

    try {
      const user = await User.findByOrFail("email", data.email);
      data.password = await Hash.make(data.password);
      console.log("user: ", user.password);
      console.log("user: ", data.password);
      const passwordMatched = await Hash.verify(user.password, data.password);
      console.log(passwordMatched);
      if (passwordMatched) {
        return response.unauthorized("Invalid email or password");
      }

      const token = await auth.use("api").generate(user, { expiresIn: "1d" });
      return response.ok({ token });
    } catch (error) {
      console.error("Login error:", error);
      return response.unauthorized("Invalid email or password");
    }
  }
}
