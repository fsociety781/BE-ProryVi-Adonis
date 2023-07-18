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
        .inTable("categories")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")
        .notNullable();
      table.string("name", 100).notNullable();
      table.string("description", 225).notNullable();
      table.string("url", 225).notNullable();
      table.integer("quantity").notNullable();
      table.float("price").notNullable();
      table.float("total").notNullable();
      table.dateTime("duedate").notNullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
