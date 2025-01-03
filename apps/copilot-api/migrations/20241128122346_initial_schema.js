// migrations/20231015123456_initial_schema.js

exports.up = function (knex) {
    return knex.schema
        .createTable('users', function (table) {
            table.uuid('uuid').primary()
        })
        .createTable("webhooks", function (table) {
            table.uuid("internal_id").primary();
            table.text("webhook_id").notNullable();
            table.text("signing_key").notNullable();
        })
        .createTable("subscribers", function (table) {
            table.text("subscriber_id").primary();
        })
        .createTable("addresses", function (table) {
            table.text("address").primary();
            table.uuid('user').references('uuid').inTable('users')
        })
        .createTable("subscriptions", function (table) {
            table
                .text("subscriber_id")
                .references("subscriber_id")
                .inTable("subscribers");
            table.text("address").references("address").inTable("addresses");
            table.primary(["subscriber_id", "address"]);
        })
        .createTable("address_webhook_map", function (table) {
            table
                .text("address")
                .primary()
                .references("address")
                .inTable("addresses");
            table
                .uuid("webhook_internal_id")
                .references("internal_id")
                .inTable("webhooks");
        });

};

exports.down = function (knex) {
    return knex.schema
        .dropTableIfExists("address_webhook_map")
        .dropTableIfExists("subscriptions")
        .dropTableIfExists("addresses")
        .dropTableIfExists("subscribers")
        .dropTableIfExists("webhooks");
};
