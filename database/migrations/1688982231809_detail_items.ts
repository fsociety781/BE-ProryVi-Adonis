import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "detail_items";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table
        .integer("categoryId")
        .unsigned()
        .references("id")
        .inTable("categories");
      table.string("name", 255).notNullable();
      table.integer("description", 225).notNullable();
      table.integer("quantity", 11).notNullable();
      table.float("price").notNullable();
      table.float("total").notNullable();
      table.datetime("duedate").notNullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
