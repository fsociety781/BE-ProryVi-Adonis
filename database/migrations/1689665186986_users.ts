import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "users";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary().notNullable();
      table.string("name", 100).notNullable();
      table.string("username", 50).notNullable();
      table.string("password", 50).unique().notNullable();
      table.string("email", 50).unique().notNullable();
      table.string("nik", 50).notNullable();
      table.string("address", 100).notNullable();
      table.string("phone", 15).notNullable();
      table.enum("role", ["admin", "member"]).defaultTo("member").notNullable();
      table.boolean("is_active").defaultTo(true).notNullable();
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
