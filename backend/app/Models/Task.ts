import { DateTime } from "luxon";
import { BaseModel, column, belongsTo, BelongsTo } from "@ioc:Adonis/Lucid/Orm";
import User from "App/Models/User";

export default class Task extends BaseModel {
  public static table = "tasks";

  @column({ isPrimary: true })
  public id: number;

  @column()
  public userid: number;

  @column()
  public name: string;

  @column()
  public description: string;

  @column()
  public date: string;

  @column()
  public category: string;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public createdat: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedat: DateTime;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;
}
