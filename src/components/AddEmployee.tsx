import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import "./AddEmployee.css";
import { getEmployees } from "../service/EmployeeService";

interface ModalProps {
  show: boolean;
  handleClose: () => void;
}

export const AddEmployee = ({show, handleClose}:ModalProps) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    age: 0,
    gender: '',
    address:''
  });

  const [employees, setEmployee] = useState([]);

  useEffect(()=>{
    const fetchEmployee = async () => {
      try{
        const data = await getEmployees();
        setEmployee(data.users);
      }
      catch{
        console.log("Failed to Load Data!")
      }
    }
    fetchEmployee();
  },[])

  
  const addEmployee = async (event:any) =>{
    event.preventDefault();
    try {
      await addEmployee(formData);
      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        age: 0,
        gender: '',
        address:''
      });
      console.log('User added successfully');
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  // if(!show){
  //   return null;
  // }

  return (
    <>
      <div className="form-header">
        <h2>Employee Management</h2>
      </div>      
      <Container className="form-wrap"  id="exampleModalCenter"> 
        <form>
                <div className="form-group">
                  <label>First Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstname"
                    value={formData.firstname}
                    placeholder="Enter FirstName"
                    onChange={handleChange}
                  ></input>
                </div>
                <div className="form-group">
                  <label>Last Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastname"
                    value={formData.lastname}
                    placeholder="Enter LastName"
                    onChange={handleChange}
                  ></input>
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    placeholder="Enter Email"
                    onChange={handleChange}
                  ></input>
                </div>
                <div className="form-group">
                  <label>Age:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="age"
                    value={formData.age}
                    placeholder="Enter Age"
                    onChange={handleChange}
                  ></input>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="male"
                    value="male"
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="male">
                    Male
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="female"
                    value="female"
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="female">
                    Female
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="other"
                    value="other"
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="other">
                    Other
                  </label>
                </div>
                <div className="add-btn">
                  <button className="btn btn-primary" onClick={addEmployee}>Add Employee</button>
                </div>

                
          {/* <div className="modal-backdrop">
            <div className="modal">
              <div className="modal-header">
                <h5 className="modal-title">Employee Management</h5>
                <button type="button" className="close" onClick={handleClose}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>First Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstname"
                    value=""
                    placeholder="Enter FirstName"
                    onChange={handleChange}
                  ></input>
                </div>
                <div className="form-group">
                  <label>Last Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastname"
                    value=""
                    placeholder="Enter LastName"
                    onChange={handleChange}
                  ></input>
                </div>
                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value=""
                    placeholder="Enter Email"
                    onChange={handleChange}
                  ></input>
                </div>
                <div className="form-group">
                  <label>Age:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="age"
                    value=""
                    placeholder="Enter Age"
                    onChange={handleChange}
                  ></input>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="male"
                    id="male"
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="male">
                    Male
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="female"
                    id="female"
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="female">
                    Female
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="other"
                    id="other"
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="other">
                    Other
                  </label>
                </div>
                <div className="add-btn">
                  <button className="btn btn-primary">Add Employee</button>
                </div>
              </div>
            </div>
          </div> */}
        </form>
      </Container> 


      {/* list of employees */}
          <div>
            <h2>Employees</h2>
            <ul>
              {
                employees.map((emp:any)=>(
                  <li key={emp.id}>{emp.firstName}</li>
                ))
              }
            </ul>
          </div>
    </>
  );
};
