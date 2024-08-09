import { DateTime } from "luxon";
import { column, BaseModel } from "@ioc:Adonis/Lucid/Orm";

export default class Admin extends BaseModel {
  public static table = "admins";

  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public rememberMeToken: string | null;

  @column()
  public role: "admin";

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime | null;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime | null;
}
