require('dotenv').config();
const mongoose = require('mongoose');
const Assignment = require('../models/Assignment');

const col = (name, dataType) => ({ name, dataType });

// Shared schema helpers
const ecommerceSchema = [
    { tableName: 'customers', columns: [col('customer_id', 'integer'), col('name', 'varchar'), col('email', 'varchar'), col('city', 'varchar'), col('joined_date', 'date')] },
    { tableName: 'products', columns: [col('product_id', 'integer'), col('name', 'varchar'), col('category', 'varchar'), col('price', 'numeric'), col('stock', 'integer')] },
    { tableName: 'orders', columns: [col('order_id', 'integer'), col('customer_id', 'integer'), col('order_date', 'date'), col('status', 'varchar')] },
    { tableName: 'order_items', columns: [col('item_id', 'integer'), col('order_id', 'integer'), col('product_id', 'integer'), col('quantity', 'integer'), col('unit_price', 'numeric')] },
];

const librarySchema = [
    { tableName: 'books', columns: [col('book_id', 'integer'), col('title', 'varchar'), col('author_id', 'integer'), col('genre', 'varchar'), col('published', 'integer'), col('copies', 'integer')] },
    { tableName: 'authors', columns: [col('author_id', 'integer'), col('name', 'varchar'), col('country', 'varchar')] },
    { tableName: 'members', columns: [col('member_id', 'integer'), col('name', 'varchar'), col('email', 'varchar'), col('joined_date', 'date')] },
    { tableName: 'loans', columns: [col('loan_id', 'integer'), col('book_id', 'integer'), col('member_id', 'integer'), col('loan_date', 'date'), col('return_date', 'date'), col('returned', 'boolean')] },
];

const hrSchema = [
    { tableName: 'employees', columns: [col('emp_id', 'integer'), col('name', 'varchar'), col('dept_id', 'integer'), col('title', 'varchar'), col('hire_date', 'date'), col('manager_id', 'integer')] },
    { tableName: 'departments', columns: [col('dept_id', 'integer'), col('name', 'varchar'), col('location', 'varchar')] },
    { tableName: 'salaries', columns: [col('salary_id', 'integer'), col('emp_id', 'integer'), col('amount', 'numeric'), col('effective_date', 'date')] },
];

const assignments = [

    // ─────────────────────────────────────────────────
    // EASY (10)
    // ─────────────────────────────────────────────────

    {
        title: 'Find All Customers',
        description: 'Write a query to retrieve the name, email, and city of all customers ordered alphabetically by name.',
        difficulty: 'Easy',
        tables: ['customers', 'orders', 'products', 'order_items'],
        expectedConcepts: ['SELECT', 'ORDER BY', 'column selection'],
        schemaInfo: ecommerceSchema,
    },
    {
        title: 'List All Products',
        description: 'Retrieve the name, category, and price of every product in the store. Sort results by price from lowest to highest.',
        difficulty: 'Easy',
        tables: ['customers', 'orders', 'products', 'order_items'],
        expectedConcepts: ['SELECT', 'ORDER BY', 'numeric sorting'],
        schemaInfo: ecommerceSchema,
    },
    {
        title: 'Electronics Products',
        description: 'Find all products that belong to the "Electronics" category. Show their name, price, and stock quantity.',
        difficulty: 'Easy',
        tables: ['customers', 'orders', 'products', 'order_items'],
        expectedConcepts: ['SELECT', 'WHERE', 'string filtering'],
        schemaInfo: ecommerceSchema,
    },
    {
        title: 'Customers from New York',
        description: 'Retrieve the names and emails of all customers who are based in New York.',
        difficulty: 'Easy',
        tables: ['customers', 'orders', 'products', 'order_items'],
        expectedConcepts: ['SELECT', 'WHERE', 'string filtering'],
        schemaInfo: ecommerceSchema,
    },
    {
        title: 'List Books by Genre',
        description: 'Retrieve all books in the "Mystery" genre. Display the title, author_id, and publication year. Sort by publication year ascending.',
        difficulty: 'Easy',
        tables: ['books', 'authors', 'members', 'loans'],
        expectedConcepts: ['SELECT', 'WHERE', 'ORDER BY', 'filtering'],
        schemaInfo: librarySchema,
    },
    {
        title: 'All Library Members',
        description: 'List all library members showing their name, email, and the date they joined. Order by joined_date ascending.',
        difficulty: 'Easy',
        tables: ['books', 'authors', 'members', 'loans'],
        expectedConcepts: ['SELECT', 'ORDER BY', 'date sorting'],
        schemaInfo: librarySchema,
    },
    {
        title: 'Books Published Before 1970',
        description: 'Find all books published before 1970. Return the title, genre, and year published.',
        difficulty: 'Easy',
        tables: ['books', 'authors', 'members', 'loans'],
        expectedConcepts: ['SELECT', 'WHERE', 'numeric comparison'],
        schemaInfo: librarySchema,
    },
    {
        title: 'Employees by Department',
        description: 'List all employees showing their name, title, and hire_date. Order results by hire_date ascending.',
        difficulty: 'Easy',
        tables: ['employees', 'departments', 'salaries'],
        expectedConcepts: ['SELECT', 'ORDER BY', 'date sorting'],
        schemaInfo: hrSchema,
    },
    {
        title: 'All Departments and Locations',
        description: 'Retrieve the name and location of every department. Order results alphabetically by department name.',
        difficulty: 'Easy',
        tables: ['employees', 'departments', 'salaries'],
        expectedConcepts: ['SELECT', 'ORDER BY'],
        schemaInfo: hrSchema,
    },
    {
        title: 'Employees Hired After 2020',
        description: 'Find all employees who were hired after January 1, 2020. Show their name, title, and hire_date.',
        difficulty: 'Easy',
        tables: ['employees', 'departments', 'salaries'],
        expectedConcepts: ['SELECT', 'WHERE', 'date comparison'],
        schemaInfo: hrSchema,
    },

    // ─────────────────────────────────────────────────
    // MEDIUM (10)
    // ─────────────────────────────────────────────────

    {
        title: 'Top 3 Customers by Spending',
        description: 'Find the top 3 customers by total spending across all orders. Display customer name and total spend, sorted highest to lowest.',
        difficulty: 'Medium',
        tables: ['customers', 'orders', 'products', 'order_items'],
        expectedConcepts: ['JOIN', 'GROUP BY', 'SUM', 'ORDER BY', 'LIMIT', 'aggregate functions'],
        schemaInfo: ecommerceSchema,
    },
    {
        title: 'Products Never Ordered',
        description: 'Identify all products that have never been included in any order. Return their name and category.',
        difficulty: 'Medium',
        tables: ['customers', 'orders', 'products', 'order_items'],
        expectedConcepts: ['LEFT JOIN', 'NOT IN', 'subquery', 'NULL checking'],
        schemaInfo: ecommerceSchema,
    },
    {
        title: 'Order Count per Customer',
        description: 'Show each customer\'s name alongside the total number of orders they have placed. Include customers with zero orders. Order by order count descending.',
        difficulty: 'Medium',
        tables: ['customers', 'orders', 'products', 'order_items'],
        expectedConcepts: ['LEFT JOIN', 'GROUP BY', 'COUNT', 'ORDER BY'],
        schemaInfo: ecommerceSchema,
    },
    {
        title: 'Delivered Orders Summary',
        description: 'List all delivered orders showing the order ID, customer name, order date, and the total order value (sum of quantity × unit_price). Order by order value descending.',
        difficulty: 'Medium',
        tables: ['customers', 'orders', 'products', 'order_items'],
        expectedConcepts: ['JOIN', 'WHERE', 'GROUP BY', 'SUM', 'expression'],
        schemaInfo: ecommerceSchema,
    },
    {
        title: 'Members with Overdue Books',
        description: 'Find all library members who currently have books that have NOT been returned (returned = false). Show the member name, book title, and loan_date.',
        difficulty: 'Medium',
        tables: ['books', 'authors', 'members', 'loans'],
        expectedConcepts: ['JOIN', 'WHERE', 'boolean filtering', 'multiple joins'],
        schemaInfo: librarySchema,
    },
    {
        title: 'Books with Author Country',
        description: 'List every book\'s title, genre, publication year, and the author\'s name and country. Order by author name, then publication year.',
        difficulty: 'Medium',
        tables: ['books', 'authors', 'members', 'loans'],
        expectedConcepts: ['JOIN', 'ORDER BY', 'multi-column sorting'],
        schemaInfo: librarySchema,
    },
    {
        title: 'Most Loaned Books',
        description: 'Find the top 5 most loaned books (by total loan count). Display the book title and total loan count, ordered from most to least.',
        difficulty: 'Medium',
        tables: ['books', 'authors', 'members', 'loans'],
        expectedConcepts: ['JOIN', 'GROUP BY', 'COUNT', 'ORDER BY', 'LIMIT'],
        schemaInfo: librarySchema,
    },
    {
        title: 'Average Salary by Department',
        description: 'Calculate the average salary for each department. Show the department name, number of employees, and average salary rounded to 2 decimal places. Order by average salary descending.',
        difficulty: 'Medium',
        tables: ['employees', 'departments', 'salaries'],
        expectedConcepts: ['JOIN', 'GROUP BY', 'AVG', 'COUNT', 'ROUND', 'ORDER BY'],
        schemaInfo: hrSchema,
    },
    {
        title: 'Employees and Their Managers',
        description: 'List each employee\'s name alongside their manager\'s name. Employees with no manager should still appear with NULL in the manager column.',
        difficulty: 'Medium',
        tables: ['employees', 'departments', 'salaries'],
        expectedConcepts: ['self JOIN', 'LEFT JOIN', 'aliasing'],
        schemaInfo: hrSchema,
    },
    {
        title: 'Highest Paid Employee per Department',
        description: 'Find the highest-paid employee in each department. Show department name, employee name, and their salary.',
        difficulty: 'Medium',
        tables: ['employees', 'departments', 'salaries'],
        expectedConcepts: ['JOIN', 'GROUP BY', 'MAX', 'subquery', 'aggregate functions'],
        schemaInfo: hrSchema,
    },

    // ─────────────────────────────────────────────────
    // HARD (10)
    // ─────────────────────────────────────────────────

    {
        title: 'Monthly Revenue Report',
        description: 'Calculate total revenue per month in 2024. Show month number, month name, and total revenue (delivered orders only), ordered chronologically.',
        difficulty: 'Hard',
        tables: ['customers', 'orders', 'products', 'order_items'],
        expectedConcepts: ['DATE functions', 'EXTRACT', 'TO_CHAR', 'JOIN', 'GROUP BY', 'WHERE', 'SUM'],
        schemaInfo: ecommerceSchema,
    },
    {
        title: 'Customer Retention Analysis',
        description: 'Find customers who placed orders in both January 2024 AND March 2024. Return their name, city, and total number of orders they placed across the entire dataset.',
        difficulty: 'Hard',
        tables: ['customers', 'orders', 'products', 'order_items'],
        expectedConcepts: ['subquery', 'INTERSECT or EXISTS', 'EXTRACT', 'GROUP BY', 'HAVING'],
        schemaInfo: ecommerceSchema,
    },
    {
        title: 'Product Category Revenue Share',
        description: 'Calculate the total revenue for each product category and its percentage share of overall revenue. Show category, total revenue, and revenue percentage rounded to 1 decimal place. Order by revenue descending.',
        difficulty: 'Hard',
        tables: ['customers', 'orders', 'products', 'order_items'],
        expectedConcepts: ['JOIN', 'GROUP BY', 'SUM', 'window function or subquery', 'percentage calculation', 'ROUND'],
        schemaInfo: ecommerceSchema,
    },
    {
        title: 'Running Total of Orders',
        description: 'Show each order\'s ID, date, total value, and a running cumulative total of revenue ordered by order_date ascending. Only include delivered orders.',
        difficulty: 'Hard',
        tables: ['customers', 'orders', 'products', 'order_items'],
        expectedConcepts: ['window functions', 'SUM OVER', 'ORDER BY', 'JOIN', 'WHERE'],
        schemaInfo: ecommerceSchema,
    },
    {
        title: 'Most Borrowed Authors',
        description: 'Find the top 3 most borrowed authors (by number of loan records). Display the author name, their country, and total loan count.',
        difficulty: 'Hard',
        tables: ['books', 'authors', 'members', 'loans'],
        expectedConcepts: ['JOIN', 'GROUP BY', 'COUNT', 'ORDER BY', 'LIMIT', 'multi-table join'],
        schemaInfo: librarySchema,
    },
    {
        title: 'Members Who Never Borrowed',
        description: 'Identify library members who have never borrowed any book. Return their name and the date they joined.',
        difficulty: 'Hard',
        tables: ['books', 'authors', 'members', 'loans'],
        expectedConcepts: ['LEFT JOIN', 'NOT EXISTS', 'NULL checking', 'subquery'],
        schemaInfo: librarySchema,
    },
    {
        title: 'Average Return Time by Genre',
        description: 'For returned books only, calculate the average number of days taken to return a book for each genre. Show the genre and average return days rounded to 1 decimal. Order by average descending.',
        difficulty: 'Hard',
        tables: ['books', 'authors', 'members', 'loans'],
        expectedConcepts: ['JOIN', 'date arithmetic', 'AVG', 'GROUP BY', 'WHERE', 'ROUND'],
        schemaInfo: librarySchema,
    },
    {
        title: 'Employees Earning Above Department Average',
        description: 'Find all employees whose salary is above the average salary of their own department. Show employee name, department name, their salary, and the department average rounded to 2 decimal places.',
        difficulty: 'Hard',
        tables: ['employees', 'departments', 'salaries'],
        expectedConcepts: ['correlated subquery', 'JOIN', 'AVG', 'subquery in WHERE', 'comparison operators'],
        schemaInfo: hrSchema,
    },
    {
        title: 'Salary Rank within Department',
        description: 'Rank employees by salary within each department using a window function. Show employee name, department name, salary, and their rank (1 = highest paid). Order by department name, then rank.',
        difficulty: 'Hard',
        tables: ['employees', 'departments', 'salaries'],
        expectedConcepts: ['window functions', 'RANK OVER PARTITION BY', 'JOIN', 'ORDER BY'],
        schemaInfo: hrSchema,
    },
    {
        title: 'Department Salary Growth',
        description: 'For each department, find the employee with the earliest hire_date (the most senior). Return the department name, senior employee name, their salary, and total years employed (from hire_date to now) rounded to 1 decimal place.',
        difficulty: 'Hard',
        tables: ['employees', 'departments', 'salaries'],
        expectedConcepts: ['JOIN', 'MIN', 'subquery', 'date arithmetic', 'AGE or EXTRACT', 'ROUND'],
        schemaInfo: hrSchema,
    },
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await Assignment.deleteMany({});
        const result = await Assignment.insertMany(assignments);
        console.log(`Inserted ${result.length} assignments into MongoDB`);

        const easy = assignments.filter(a => a.difficulty === 'Easy').length;
        const medium = assignments.filter(a => a.difficulty === 'Medium').length;
        const hard = assignments.filter(a => a.difficulty === 'Hard').length;
        console.log(`  Easy: ${easy} | Medium: ${medium} | Hard: ${hard}`);
    } catch (err) {
        console.error('MongoDB seeding failed:', err.message);
        if (err.errors) {
            Object.keys(err.errors).forEach(k => console.error('  ', k, '-', err.errors[k].message));
        }
        throw err;
    } finally {
        await mongoose.disconnect();
    }
};

seed().catch(() => process.exit(1));
