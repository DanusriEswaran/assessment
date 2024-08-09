import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Admin from "App/Models/Admin";
import AdminRegisterValidator from "App/Validators/AdminRegisterValidator";
import AdminLoginValidator from "App/Validators/AdminLoginValidator";

export default class AdminsController {
  public async register({ auth, request, response }: HttpContextContract) {
    const data = await request.validate(AdminRegisterValidator);

    try {
      const admin = await Admin.create({
        name: data.name,
        email: data.email,
        password: data.password, // Store password as plain text
      });

      const token = await auth.use("api").generate(admin, { expiresIn: "1d" });
      return response.created({
        message: "Admin registered successfully",
        token,
      });
    } catch (error) {
      console.error("Error creating admin:", error);
      return response.internalServerError("Error registering admin");
    }
  }

  public async login({ request, auth, response }: HttpContextContract) {
    const data = await request.validate(AdminLoginValidator);

    try {
      const admin = await Admin.findByOrFail("email", data.email);

      // Verify password by comparing plain text
      if (admin.password !== data.password) {
        return response.unauthorized("Invalid email or password");
      }

      const token = await auth.use("api").generate(admin, { expiresIn: "1d" });
      return response.ok({ token });
    } catch (error) {
      console.error("Login error:", error);
      return response.unauthorized("Invalid email or password");
    }
  }
}
