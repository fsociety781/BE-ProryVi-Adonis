import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "users";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table.string("name", 50).notNullable();
      table.string("nik", 20).notNullable();
      table.string("phone", 20).notNullable();
      table.string("address", 255).notNullable();
      table.string("username", 50).notNullable().unique();
      table.string("email", 255).notNullable().unique();
      table.string("password", 180).notNullable();
      table.enum("role", ["admin", "member"]).defaultTo("member");
      table.tinyint("is_active").defaultTo(1);
      // table.string("remember_me_token").nullable();

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
