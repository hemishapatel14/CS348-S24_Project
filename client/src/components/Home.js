// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import "./Home.css";
// import { toast } from "react-toastify";
// import axios from "axios";

// const Home = () => {
//     const [data, setData] = useState([]);
//     const [categories, setCategories] = useState([]);
//     const [selectedCategory, setSelectedCategory] = useState('');
//     const [filteredExpenses, setFilteredExpenses] = useState([]);

//     useEffect(() => {
//         loadData();
//         fetchCategories();
//     }, []);

//     const loadData = async () => {
//         try {
//             const response = await axios.get("http://localhost:3002/api/get");
//             setData(response.data);
//         } catch (error) {
//             console.error("Error fetching expenses:", error);
//             toast.error("Failed to fetch expenses");
//         }
//     };

//     const fetchCategories = async () => {
//         try {
//             const response = await axios.get('http://localhost:3002/api/categories');
//             setCategories(response.data);
//         } catch (error) {
//             console.error('Error fetching categories:', error);
//             toast.error("Failed to fetch categories");
//         }
//     };
// Import useState, useEffect, Link
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "./Home.css";
import { toast } from "react-toastify";
import axios from "axios";

const Home = () => {
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [filteredExpenses, setFilteredExpenses] = useState([]);

    useEffect(() => {
        loadData();
        fetchCategories();
    }, []);

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (user) {
            fetchExpenses();
        }
    }, [user]);

    const loadData = async () => {
        try {
            const response = await axios.get("http://localhost:3002/api/get");
            setData(response.data);
        } catch (error) {
            console.error("Error fetching expenses:", error);
            toast.error("Failed to fetch expenses");
        }
    };

    const fetchExpenses = async () => {
        try {
            const response = await axios.get("http://localhost:3002/api/get");
            const expenses = response.data.filter(expense => expense.user_id === user.user_id);
            setData(expenses);
        } catch (error) {
            console.error("Error fetching expenses:", error);
            toast.error("Failed to fetch expenses");
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:3002/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error("Failed to fetch categories");
        }
    };


    const handleDelete = async (expenseId) => {
        try {
            await axios.delete(`http://localhost:3002/api/expenses/${expenseId}`);
            toast.success("Expense deleted successfully");
            // Reload data after deletion
            loadData();
        } catch (error) {
            console.error("Error deleting expense:", error);
            toast.error("Failed to delete expense");
        }
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleFilter = async () => {
        try {
            let response;
            if (selectedCategory === '') {
                response = await axios.get(`http://localhost:3002/api/get`);
            } else {
                response = await axios.get(`http://localhost:3002/api/expensesByCategory/${selectedCategory}`);
            }
            setFilteredExpenses(response.data);
        } catch (error) {
            console.error('Error fetching filtered expenses:', error);
            toast.error("Failed to fetch filtered expenses");
        }
    };
    

    return (
        <div style={{ marginTop: "150px" }}>
            <Link to="/addExpense">
                <button className='btn btn-contact'>Add Expense</button>
            </Link>
            <h2>Expense Tracker</h2>
            <div>
                <label htmlFor="category">Select Category:</label>
                <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
                    <option value="">All Categories</option>
                    {categories.map(category => (
                        <option key={category.category_id} value={category.category_name}>
                            {category.category_name}
                        </option>
                    ))}
                </select>
                <button onClick={handleFilter}>Filter</button>
            </div>
            <table className='styled-table'>
                <thead>
                    <tr>
                        <th style={{ textAlign: "center" }}>No.</th>
                        <th style={{ textAlign: "center" }}>Expense Name</th>
                        <th style={{ textAlign: "center" }}>Amount</th>
                        <th style={{ textAlign: "center" }}>Description</th>
                        <th style={{ textAlign: "center" }}>Category</th>
                        <th style={{ textAlign: "center" }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredExpenses.map((item, index) => (
                        <tr key={item.expense_id}>
                            <th scope='row'>{index + 1}</th>
                            <td>{item.expense_name}</td>
                            <td>{item.amount}</td>
                            <td>{item.description}</td>
                            <td>{item.category_name}</td>
                            <td>
                                <Link to={`/updateExpense/${item.expense_id}`}>
                                    <button className='btn btn-edit'>Edit</button>
                                </Link>
                                <button className='btn btn-delete' onClick={() => handleDelete(item.expense_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    {filteredExpenses.length === 0 && (
                        <tr>
                            <td colSpan="6" style={{ textAlign: "center" }}>No expenses found for the selected category.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Home;
