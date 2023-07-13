import { DateTime } from "luxon";
import Hash from "@ioc:Adonis/Core/Hash";
import { BaseModel, beforeSave, column } from "@ioc:Adonis/Lucid/Orm";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public email: string;

  @column()
  public username: string;

  @column()
  public name: string;

  @column()
  public nik: string;

  @column()
  public phone: string;

  @column()
  public address: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public role: string;

  @column()
  public isActive: number;

  // @column()
  // public rememberMeToken?: string | null;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }
}
