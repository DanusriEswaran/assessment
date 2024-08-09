import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Admins extends BaseSchema {
  protected tableName = "admins";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.string("name").notNullable();
      table.string("email").notNullable().unique();
      table.string("password", 180).notNullable();
      table.string("remember_me_token").nullable();
      table.enum("role", ["admin"]).notNullable();
      table.timestamp("created_at", { useTz: true }).nullable(); // Allow NULL values
      table.timestamp("updated_at", { useTz: true }).defaultTo(this.now()); // Set default value
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
