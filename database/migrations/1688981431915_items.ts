import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "items";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table.integer("userId").unsigned().references("id").inTable("users");
      table
        .integer("detailId")
        .unsigned()
        .references("id")
        .inTable("detail_items");
      table
        .enum("status", ["Onprocces", "Approved", "Rejected"])
        .defaultTo("Onprocces");
      table.timestamp("created_at").defaultTo(this.raw("CURRENT_TIMESTAMP"));
      table
        .timestamp("updated_at")
        .defaultTo(this.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
