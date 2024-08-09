import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "tasks";

  public async up() {
    this.schema.alterTable("tasks", (table) => {
      table.string("status").notNullable().defaultTo("In Progress");
    });
  }

  public async down() {
    this.schema.alterTable("tasks", (table) => {
      table.dropColumn("status");
    });
  }
}
