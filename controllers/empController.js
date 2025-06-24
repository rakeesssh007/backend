const path = require('path');
const data = {
    employees: require('../models/employees.json'),
    setEmployee: function (newData) {
        this.employees = newData;
    }
};

// Create a new employee
const createEmployee = (req, res) => {
    const newEmployee = {
        _id: data.employees.length ? data.employees[data.employees.length - 1]._id + 1 : 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    };

    if (!newEmployee.firstname || !newEmployee.lastname) {
        return res.status(400).json({ message: "First name and last name are required" });
    }

    data.setEmployee([...data.employees, newEmployee]);
    res.status(201).json(data.employees);
};

// Update an existing employee
const updateEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp._id === parseInt(req.body.id));

    if (!employee) {
        return res.status(400).json({ message: `Employee id ${req.body.id} not found` });
    }

    if (req.body.firstname) employee.firstname = req.body.firstname;
    if (req.body.lastname) employee.lastname = req.body.lastname;

    const filteredArray = data.employees.filter(emp => emp._id !== parseInt(req.body.id));
    const updatedArray = [...filteredArray, employee].sort((a, b) => a._id - b._id);

    data.setEmployee(updatedArray);
    res.json(data.employees);
};

// Delete an employee
const deleteEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp._id === parseInt(req.body.id));

    if (!employee) {
        return res.status(400).json({ message: `Employee id ${req.body.id} not found` });
    }

    const filteredArray = data.employees.filter(emp => emp._id !== parseInt(req.body.id));
    data.setEmployee(filteredArray);
    res.json(data.employees);
};

// Get all employees
const getAllEmployees = (req, res) => {
    res.json(data.employees);
};

// Get a single employee by ID
const getEmployee = (req, res) => {
    const employee = data.employees.find(emp => emp._id === parseInt(req.params.id));

    if (!employee) {
        return res.status(400).json({ message: `Employee id ${req.params.id} not found` });
    }

    res.json(employee);
};

module.exports = {
    getAllEmployees,
    getEmployee,
    updateEmployee,
    createEmployee,
    deleteEmployee
};
