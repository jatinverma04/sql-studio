require('dotenv').config();
const mongoose = require('mongoose');
const Assignment = require('../models/Assignment');


const col = (name, dataType) => ({ name, dataType });

const assignments = [
    // E-COMMERCE
    {
        title: 'Find All Customers',
        description: 'Write a query to retrieve the name, email, and city of all customers ordered alphabetically by name.',
        difficulty: 'Easy',
        tables: ['customers', 'orders', 'products', 'order_items'],
        expectedConcepts: ['SELECT', 'ORDER BY', 'column selection'],
        schemaInfo: [
            { tableName: 'customers', columns: [col('customer_id', 'integer'), col('name', 'varchar'), col('email', 'varchar'), col('city', 'varchar'), col('joined_date', 'date')] },
            { tableName: 'products', columns: [col('product_id', 'integer'), col('name', 'varchar'), col('category', 'varchar'), col('price', 'numeric'), col('stock', 'integer')] },
            { tableName: 'orders', columns: [col('order_id', 'integer'), col('customer_id', 'integer'), col('order_date', 'date'), col('status', 'varchar')] },
            { tableName: 'order_items', columns: [col('item_id', 'integer'), col('order_id', 'integer'), col('product_id', 'integer'), col('quantity', 'integer'), col('unit_price', 'numeric')] },
        ],
    },
    {
        title: 'Top 3 Customers by Spending',
        description: 'Find the top 3 customers by total spending across all orders. Display customer name and total spend, sorted highest to lowest.',
        difficulty: 'Medium',
        tables: ['customers', 'orders', 'products', 'order_items'],
        expectedConcepts: ['JOIN', 'GROUP BY', 'SUM', 'ORDER BY', 'LIMIT', 'aggregate functions'],
        schemaInfo: [
            { tableName: 'customers', columns: [col('customer_id', 'integer'), col('name', 'varchar'), col('email', 'varchar'), col('city', 'varchar')] },
            { tableName: 'orders', columns: [col('order_id', 'integer'), col('customer_id', 'integer'), col('order_date', 'date'), col('status', 'varchar')] },
            { tableName: 'order_items', columns: [col('item_id', 'integer'), col('order_id', 'integer'), col('product_id', 'integer'), col('quantity', 'integer'), col('unit_price', 'numeric')] },
        ],
    },
    {
        title: 'Products Never Ordered',
        description: 'Identify all products that have never been included in any order. Return their name and category.',
        difficulty: 'Medium',
        tables: ['customers', 'orders', 'products', 'order_items'],
        expectedConcepts: ['LEFT JOIN', 'NOT IN', 'subquery', 'NULL checking'],
        schemaInfo: [
            { tableName: 'products', columns: [col('product_id', 'integer'), col('name', 'varchar'), col('category', 'varchar'), col('price', 'numeric'), col('stock', 'integer')] },
            { tableName: 'order_items', columns: [col('item_id', 'integer'), col('order_id', 'integer'), col('product_id', 'integer'), col('quantity', 'integer')] },
        ],
    },
    {
        title: 'Monthly Revenue Report',
        description: 'Calculate total revenue per month in 2024. Show month number, month name, and total revenue (delivered orders only), ordered chronologically.',
        difficulty: 'Hard',
        tables: ['customers', 'orders', 'products', 'order_items'],
        expectedConcepts: ['DATE functions', 'EXTRACT', 'TO_CHAR', 'JOIN', 'GROUP BY', 'WHERE', 'SUM'],
        schemaInfo: [
            { tableName: 'orders', columns: [col('order_id', 'integer'), col('customer_id', 'integer'), col('order_date', 'date'), col('status', 'varchar')] },
            { tableName: 'order_items', columns: [col('item_id', 'integer'), col('order_id', 'integer'), col('quantity', 'integer'), col('unit_price', 'numeric')] },
        ],
    },

    // LIBRARY
    {
        title: 'List Books by Genre',
        description: 'Retrieve all books in the "Mystery" genre. Display the book title, author name, and publication year. Sort by publication year ascending.',
        difficulty: 'Easy',
        tables: ['books', 'authors', 'members', 'loans'],
        expectedConcepts: ['SELECT', 'JOIN', 'WHERE', 'ORDER BY', 'filtering'],
        schemaInfo: [
            { tableName: 'books', columns: [col('book_id', 'integer'), col('title', 'varchar'), col('author_id', 'integer'), col('genre', 'varchar'), col('published', 'integer'), col('copies', 'integer')] },
            { tableName: 'authors', columns: [col('author_id', 'integer'), col('name', 'varchar'), col('country', 'varchar')] },
            { tableName: 'members', columns: [col('member_id', 'integer'), col('name', 'varchar'), col('email', 'varchar'), col('joined_date', 'date')] },
            { tableName: 'loans', columns: [col('loan_id', 'integer'), col('book_id', 'integer'), col('member_id', 'integer'), col('loan_date', 'date'), col('return_date', 'date'), col('returned', 'boolean')] },
        ],
    },
    {
        title: 'Members with Overdue Books',
        description: 'Find all library members who currently have books that have NOT been returned. Show the member name, book title, and loan date.',
        difficulty: 'Medium',
        tables: ['books', 'authors', 'members', 'loans'],
        expectedConcepts: ['JOIN', 'WHERE', 'boolean filtering', 'multiple joins'],
        schemaInfo: [
            { tableName: 'books', columns: [col('book_id', 'integer'), col('title', 'varchar'), col('genre', 'varchar')] },
            { tableName: 'members', columns: [col('member_id', 'integer'), col('name', 'varchar'), col('email', 'varchar')] },
            { tableName: 'loans', columns: [col('loan_id', 'integer'), col('book_id', 'integer'), col('member_id', 'integer'), col('loan_date', 'date'), col('returned', 'boolean')] },
        ],
    },
    {
        title: 'Most Borrowed Authors',
        description: 'Find the top 3 most borrowed authors (by number of loan records). Display the author name, their country, and total loan count.',
        difficulty: 'Hard',
        tables: ['books', 'authors', 'members', 'loans'],
        expectedConcepts: ['JOIN', 'GROUP BY', 'COUNT', 'ORDER BY', 'LIMIT', 'multi-table join'],
        schemaInfo: [
            { tableName: 'authors', columns: [col('author_id', 'integer'), col('name', 'varchar'), col('country', 'varchar')] },
            { tableName: 'books', columns: [col('book_id', 'integer'), col('title', 'varchar'), col('author_id', 'integer')] },
            { tableName: 'loans', columns: [col('loan_id', 'integer'), col('book_id', 'integer'), col('returned', 'boolean')] },
        ],
    },

    // HR
    {
        title: 'Employees by Department',
        description: 'List all employees along with their department name and job title. Order results by department name, then employee name.',
        difficulty: 'Easy',
        tables: ['employees', 'departments', 'salaries'],
        expectedConcepts: ['SELECT', 'JOIN', 'ORDER BY', 'column aliasing'],
        schemaInfo: [
            { tableName: 'employees', columns: [col('emp_id', 'integer'), col('name', 'varchar'), col('dept_id', 'integer'), col('title', 'varchar'), col('hire_date', 'date'), col('manager_id', 'integer')] },
            { tableName: 'departments', columns: [col('dept_id', 'integer'), col('name', 'varchar'), col('location', 'varchar')] },
            { tableName: 'salaries', columns: [col('salary_id', 'integer'), col('emp_id', 'integer'), col('amount', 'numeric'), col('effective_date', 'date')] },
        ],
    },
    {
        title: 'Average Salary by Department',
        description: 'Calculate the average salary for each department. Show the department name, number of employees, and average salary rounded to 2 decimal places. Order by average salary descending.',
        difficulty: 'Medium',
        tables: ['employees', 'departments', 'salaries'],
        expectedConcepts: ['JOIN', 'GROUP BY', 'AVG', 'COUNT', 'ROUND', 'ORDER BY'],
        schemaInfo: [
            { tableName: 'employees', columns: [col('emp_id', 'integer'), col('name', 'varchar'), col('dept_id', 'integer')] },
            { tableName: 'departments', columns: [col('dept_id', 'integer'), col('name', 'varchar')] },
            { tableName: 'salaries', columns: [col('salary_id', 'integer'), col('emp_id', 'integer'), col('amount', 'numeric')] },
        ],
    },
    {
        title: 'Employees Earning Above Department Average',
        description: 'Find all employees whose salary is above the average salary of their own department. Show employee name, department name, their salary, and the department average.',
        difficulty: 'Hard',
        tables: ['employees', 'departments', 'salaries'],
        expectedConcepts: ['correlated subquery', 'JOIN', 'AVG', 'subquery in WHERE', 'comparison operators'],
        schemaInfo: [
            { tableName: 'employees', columns: [col('emp_id', 'integer'), col('name', 'varchar'), col('dept_id', 'integer')] },
            { tableName: 'departments', columns: [col('dept_id', 'integer'), col('name', 'varchar')] },
            { tableName: 'salaries', columns: [col('salary_id', 'integer'), col('emp_id', 'integer'), col('amount', 'numeric')] },
        ],
    },
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await Assignment.deleteMany({});
        const result = await Assignment.insertMany(assignments);
        console.log(`Inserted ${result.length} assignments into MongoDB`);
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
