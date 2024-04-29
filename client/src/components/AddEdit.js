import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './AddEdit.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const initialState = {
  expense_name: '',
  amount: '',
  expense_description: '',
  category_id: '' // Add category_id to the initial state
};

const AddEdit = () => {
  const [state, setState] = useState(initialState);
  const [categories, setCategories] = useState([]); // State to store categories
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories when component mounts
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3002/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3002/api/get/${id}`)
        .then((response) => {
          setState(response.data[0]);
        })
        .catch((error) => {
          console.error('Error fetching expense details:', error);
        });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { expense_name, amount, expense_description, category_id } = state;
    if (!expense_name || !amount || !expense_description || !category_id) {
      toast.error('Please fill out all the fields');
    } else {
      try {
        if (id) {
          await axios.put(`http://localhost:3002/api/put/${id}`, state);
          toast.success('Expense updated successfully');
        } else {
          await axios.post('http://localhost:3002/api/expenses', state);
          toast.success('Expense added successfully');
        }
        navigate('/');
      } catch (error) {
        toast.error('Error saving expense');
        console.error('Error saving expense:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <label htmlFor="expense_name">Expense Name</label>
        <input
          type="text"
          id="expense_name"
          name="expense_name"
          placeholder="Add expense name here..."
          value={state.expense_name}
          onChange={handleInputChange}
          className="input-field"
        />

        <label htmlFor="amount">Amount</label>
        <input
          type="text"
          id="amount"
          name="amount"
          placeholder="Add amount here..."
          value={state.amount}
          onChange={handleInputChange}
          className="input-field"
        />

        <label htmlFor="expense_description">Expense Description</label>
        <input
          type="text"
          id="expense_description"
          name="expense_description"
          placeholder="Add expense description here..."
          value={state.expense_description}
          onChange={handleInputChange}
          className="input-field"
        />

        <label htmlFor="category_id">Category</label>
        <select
          id="category_id"
          name="category_id"
          value={state.category_id}
          onChange={handleInputChange}
          className="input-field"
        >
          <option value="">Select category...</option>
          {categories.map(category => (
            <option key={category.category_id} value={category.category_id}>{category.category_name}</option>
          ))}
        </select>

        <input type="submit" value="Save" className="submit-btn" />
        <Link to="/" className="link-btn">
          <input type="button" value="Go Back" className="back-btn" />
        </Link>
      </form>
    </div>
  );
};

export default AddEdit;

