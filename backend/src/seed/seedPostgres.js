
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.POSTGRES_URL });

const seed = async () => {
  const client = await pool.connect();
  try {
    console.log('🌱 Seeding PostgreSQL sandbox...');

    // E-COMMERCE DATASET
    await client.query(`
      DROP TABLE IF EXISTS order_items CASCADE;
      DROP TABLE IF EXISTS orders CASCADE;
      DROP TABLE IF EXISTS products CASCADE;
      DROP TABLE IF EXISTS customers CASCADE;

      CREATE TABLE customers (
        customer_id SERIAL PRIMARY KEY,
        name        VARCHAR(100) NOT NULL,
        email       VARCHAR(150) UNIQUE NOT NULL,
        city        VARCHAR(80),
        joined_date DATE NOT NULL
      );

      CREATE TABLE products (
        product_id  SERIAL PRIMARY KEY,
        name        VARCHAR(150) NOT NULL,
        category    VARCHAR(80),
        price       NUMERIC(10,2) NOT NULL,
        stock       INT DEFAULT 0
      );

      CREATE TABLE orders (
        order_id    SERIAL PRIMARY KEY,
        customer_id INT REFERENCES customers(customer_id),
        order_date  DATE NOT NULL,
        status      VARCHAR(30) DEFAULT 'pending'
      );

      CREATE TABLE order_items (
        item_id    SERIAL PRIMARY KEY,
        order_id   INT REFERENCES orders(order_id),
        product_id INT REFERENCES products(product_id),
        quantity   INT NOT NULL,
        unit_price NUMERIC(10,2) NOT NULL
      );
    `);

    await client.query(`
      INSERT INTO customers (name, email, city, joined_date) VALUES
        ('Alice Johnson',  'alice@example.com',  'New York',    '2022-01-15'),
        ('Bob Smith',      'bob@example.com',    'Los Angeles', '2022-03-22'),
        ('Carol White',    'carol@example.com',  'Chicago',     '2021-11-05'),
        ('David Brown',    'david@example.com',  'Houston',     '2023-02-10'),
        ('Emma Davis',     'emma@example.com',   'Phoenix',     '2022-07-19'),
        ('Frank Miller',   'frank@example.com',  'New York',    '2021-09-30'),
        ('Grace Wilson',   'grace@example.com',  'Chicago',     '2023-04-01'),
        ('Henry Moore',    'henry@example.com',  'Los Angeles', '2022-12-15');

      INSERT INTO products (name, category, price, stock) VALUES
        ('Laptop Pro 15',    'Electronics',  1299.99, 45),
        ('Wireless Mouse',   'Electronics',    29.99, 200),
        ('Office Chair',     'Furniture',     299.99, 30),
        ('Standing Desk',    'Furniture',     499.99, 15),
        ('Python Textbook',  'Books',          49.99, 100),
        ('USB-C Hub',        'Electronics',    59.99, 150),
        ('Notebook 200pg',   'Stationery',      4.99, 500),
        ('Mechanical Keyboard','Electronics', 129.99, 80);

      INSERT INTO orders (customer_id, order_date, status) VALUES
        (1, '2024-01-05', 'delivered'),
        (1, '2024-03-20', 'delivered'),
        (2, '2024-02-14', 'delivered'),
        (3, '2024-01-20', 'shipped'),
        (4, '2024-03-01', 'pending'),
        (5, '2024-02-28', 'delivered'),
        (6, '2024-03-15', 'cancelled'),
        (7, '2024-03-18', 'delivered'),
        (8, '2024-01-30', 'delivered'),
        (2, '2024-03-25', 'pending');

      INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
        (1, 1, 1, 1299.99),
        (1, 2, 2,   29.99),
        (2, 8, 1,  129.99),
        (3, 3, 1,  299.99),
        (4, 5, 2,   49.99),
        (4, 7, 5,    4.99),
        (5, 6, 1,   59.99),
        (6, 1, 1, 1299.99),
        (7, 4, 1,  499.99),
        (8, 2, 1,   29.99),
        (8, 6, 2,   59.99),
        (9, 8, 1,  129.99),
        (10,1, 1, 1299.99),
        (10,7, 10,   4.99);
    `);

    // LIBRARY DATASET
    await client.query(`
      DROP TABLE IF EXISTS loans CASCADE;
      DROP TABLE IF EXISTS books CASCADE;
      DROP TABLE IF EXISTS authors CASCADE;
      DROP TABLE IF EXISTS members CASCADE;

      CREATE TABLE authors (
        author_id  SERIAL PRIMARY KEY,
        name       VARCHAR(100) NOT NULL,
        country    VARCHAR(80)
      );

      CREATE TABLE books (
        book_id     SERIAL PRIMARY KEY,
        title       VARCHAR(200) NOT NULL,
        author_id   INT REFERENCES authors(author_id),
        genre       VARCHAR(80),
        published   INT,
        copies      INT DEFAULT 1
      );

      CREATE TABLE members (
        member_id   SERIAL PRIMARY KEY,
        name        VARCHAR(100) NOT NULL,
        email       VARCHAR(150),
        joined_date DATE
      );

      CREATE TABLE loans (
        loan_id     SERIAL PRIMARY KEY,
        book_id     INT REFERENCES books(book_id),
        member_id   INT REFERENCES members(member_id),
        loan_date   DATE NOT NULL,
        return_date DATE,
        returned    BOOLEAN DEFAULT FALSE
      );
    `);

    await client.query(`
      INSERT INTO authors (name, country) VALUES
        ('George Orwell',      'United Kingdom'),
        ('Haruki Murakami',    'Japan'),
        ('Agatha Christie',    'United Kingdom'),
        ('Gabriel García Márquez','Colombia'),
        ('J.K. Rowling',       'United Kingdom'),
        ('Fyodor Dostoevsky',  'Russia');

      INSERT INTO books (title, author_id, genre, published, copies) VALUES
        ('1984',                              1, 'Dystopian',   1949, 4),
        ('Animal Farm',                       1, 'Satire',      1945, 3),
        ('Norwegian Wood',                    2, 'Fiction',     1987, 2),
        ('Kafka on the Shore',                2, 'Magical Realism', 2002, 2),
        ('Murder on the Orient Express',      3, 'Mystery',     1934, 5),
        ('And Then There Were None',          3, 'Mystery',     1939, 3),
        ('One Hundred Years of Solitude',     4, 'Magical Realism', 1967, 2),
        ('Harry Potter and the Sorcerer''s Stone', 5, 'Fantasy', 1997, 6),
        ('Crime and Punishment',              6, 'Classic',     1866, 3),
        ('The Brothers Karamazov',            6, 'Classic',     1880, 2);

      INSERT INTO members (name, email, joined_date) VALUES
        ('Tom Allen',    'tom@mail.com',    '2022-09-01'),
        ('Sara Patel',   'sara@mail.com',   '2021-03-15'),
        ('James Lee',    'james@mail.com',  '2023-01-20'),
        ('Nina Chen',    'nina@mail.com',   '2022-06-10'),
        ('Omar Farooq',  'omar@mail.com',   '2023-05-05');

      INSERT INTO loans (book_id, member_id, loan_date, return_date, returned) VALUES
        (1,  1, '2024-01-10', '2024-01-24', TRUE),
        (3,  2, '2024-01-15', '2024-01-30', TRUE),
        (5,  3, '2024-02-01', NULL,          FALSE),
        (8,  4, '2024-02-10', '2024-02-25', TRUE),
        (2,  5, '2024-02-20', NULL,          FALSE),
        (6,  1, '2024-03-01', NULL,          FALSE),
        (9,  2, '2024-03-05', '2024-03-20', TRUE),
        (4,  3, '2024-03-10', NULL,          FALSE);
    `);

    // HR DATASET
    await client.query(`
      DROP TABLE IF EXISTS salaries CASCADE;
      DROP TABLE IF EXISTS employees CASCADE;
      DROP TABLE IF EXISTS departments CASCADE;

      CREATE TABLE departments (
        dept_id   SERIAL PRIMARY KEY,
        name      VARCHAR(100) NOT NULL,
        location  VARCHAR(80)
      );

      CREATE TABLE employees (
        emp_id    SERIAL PRIMARY KEY,
        name      VARCHAR(100) NOT NULL,
        dept_id   INT REFERENCES departments(dept_id),
        title     VARCHAR(100),
        hire_date DATE,
        manager_id INT REFERENCES employees(emp_id)
      );

      CREATE TABLE salaries (
        salary_id SERIAL PRIMARY KEY,
        emp_id    INT REFERENCES employees(emp_id),
        amount    NUMERIC(12,2),
        effective_date DATE
      );
    `);

    await client.query(`
      INSERT INTO departments (name, location) VALUES
        ('Engineering',  'San Francisco'),
        ('Marketing',    'New York'),
        ('Sales',        'Chicago'),
        ('HR',           'Austin'),
        ('Finance',      'New York');

      INSERT INTO employees (name, dept_id, title, hire_date, manager_id) VALUES
        ('John Carter',    1, 'CTO',                 '2018-03-01', NULL),
        ('Lisa Park',      1, 'Senior Engineer',      '2019-06-15', 1),
        ('Raj Patel',      1, 'Engineer',             '2021-01-10', 2),
        ('Amy Zhang',      1, 'Engineer',             '2022-07-20', 2),
        ('Mike Ross',      2, 'Marketing Director',   '2017-11-05', NULL),
        ('Sophie Turner',  2, 'Content Strategist',   '2020-03-22', 5),
        ('Kevin Hart',     3, 'Sales Manager',        '2019-08-14', NULL),
        ('Diana Prince',   3, 'Sales Rep',            '2021-05-01', 7),
        ('Clark Kent',     4, 'HR Manager',           '2018-01-15', NULL),
        ('Lois Lane',      5, 'CFO',                  '2017-04-01', NULL),
        ('Bruce Wayne',    5, 'Financial Analyst',    '2020-09-10', 10);

      INSERT INTO salaries (emp_id, amount, effective_date) VALUES
        (1,  180000, '2023-01-01'),
        (2,  130000, '2023-01-01'),
        (3,   95000, '2023-01-01'),
        (4,   92000, '2023-06-01'),
        (5,  140000, '2023-01-01'),
        (6,   85000, '2023-01-01'),
        (7,  120000, '2023-01-01'),
        (8,   75000, '2023-01-01'),
        (9,  110000, '2023-01-01'),
        (10, 175000, '2023-01-01'),
        (11,  95000, '2023-01-01');
    `);

    console.log('PostgreSQL sandbox seeded successfully!');
  } catch (err) {
    console.error('Seeding failed:', err.message);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
