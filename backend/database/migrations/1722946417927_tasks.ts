import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Tasks extends BaseSchema {
  protected tableName = "tasks";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id"); // Primary key with auto-increment

      table.integer("userid").unsigned().notNullable(); // User ID as a foreign key
      table.string("name").notNullable(); // Task name
      table.text("description").nullable(); // Task description (optional)
      table.date("date").notNullable(); // Task date
      table.string("category").nullable(); // Task category (optional)

      table
        .timestamp("createdat", { useTz: true })
        .notNullable()
        .defaultTo(this.raw("CURRENT_TIMESTAMP")); // Created at timestamp
      table
        .timestamp("updatedat", { useTz: true })
        .notNullable()
        .defaultTo(this.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")); // Updated at timestamp

      // Foreign key constraint
      table
        .foreign("userid")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE"); // Ensures referential integrity
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName); // Drop table if rolling back
  }
}
