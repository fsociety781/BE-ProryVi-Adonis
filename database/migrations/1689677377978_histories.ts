import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "histories";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table
        .integer("itemsId")
        .unsigned()
        .references("id")
        .inTable("items")
        .onUpdate("CASCADE")
        .onDelete("CASCADE")
        .notNullable();
      table.string("reason", 100).defaultTo("Pengajuan anda telah di setujui");
      table.timestamp("created_at").defaultTo(this.raw("CURRENT_TIMESTAMP"));
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
