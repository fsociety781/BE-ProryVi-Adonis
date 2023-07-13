import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class History extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public itemsId: number;

  @column()
  public reason: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;
}
