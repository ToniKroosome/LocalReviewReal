# Suggested Backend Schema

To store hierarchical Shop-Type categories with attributes, a SQL schema using a self-referencing table works well. Each category references its parent, allowing unlimited levels of nesting.

```sql
CREATE TABLE shop_type (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES shop_type(id),
    name TEXT NOT NULL,
    price_range TEXT,
    opening_hours TEXT,
    delivery_available BOOLEAN,
    pet_friendly BOOLEAN,
    wifi BOOLEAN,
    parking BOOLEAN,
    accepts_credit_cards BOOLEAN,
    reservation_required BOOLEAN,
    halal_friendly BOOLEAN,
    vegan_friendly BOOLEAN,
    covid_safe BOOLEAN
);
```

For NoSQL (e.g. MongoDB), each document could include an array of child categories to store the tree in a single document.
