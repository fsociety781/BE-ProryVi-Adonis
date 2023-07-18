import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "items";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table
        .integer("userId")
        .unsigned()
        .references("id")
        .inTable("users")
        .nullable()
        .onDelete("SET NULL");
      table
        .integer("detailId")
        .unsigned()
        .references("detail_items.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")
        .nullable();
      table
        .enum("status", ["Onprocces", "Approve", "Reject"])
        .defaultTo("Onprocces")
        .notNullable();
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
