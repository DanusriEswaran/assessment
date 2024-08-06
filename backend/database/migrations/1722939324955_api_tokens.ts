import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class ApiTokens extends BaseSchema {
  protected tableName = "api_tokens";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id");
      table.integer("user_id").unsigned().references("id").inTable("users");
      table.string("name").notNullable();
      table.string("type").notNullable();
      table.string("token", 64).notNullable().unique();
      table.timestamp("expires_at").nullable();
      table.timestamps(true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
