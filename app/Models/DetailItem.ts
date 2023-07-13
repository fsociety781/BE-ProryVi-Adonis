import { DateTime } from "luxon";
import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";

export default class DetailItem extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public categoryId: number;

  @column()
  public name: string;

  @column()
  public description: string;

  @column()
  public quantity: number;

  @column()
  public price: number;

  @column()
  public total: number;

  @column()
  public duedate: DateTime;
}
