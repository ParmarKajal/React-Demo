import { useEffect, useState } from "react";
import { getEmployees } from "../service/EmployeeService";
import { Container } from "react-bootstrap";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Employee } from "../models/Employee";
import { toast } from "react-toastify";

const initialValues = {
  firstname: "",
  lastname: "",
  email: "",
  age: 0,
  gender: "",
  address: ""
};

const validationSchema = Yup.object().shape({
  firstname: Yup.string().required("Firstname is required").matches(/^[a-zA-Z\s]*$/, "Invalid firstname"),
  lastname: Yup.string().required("Lastname is required").matches(/^[a-zA-Z\s]*$/, "Invalid lastname"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  age: Yup.number()
    .integer("Must be an integer")
    .positive("Age must be positive")
    .required("age is required"),
  gender: Yup.string()
    .required("Gender is required")
    .oneOf(["male", "female"], "Invalid gender"),
  address: Yup.string().required("Address is required"),
});

export const EmployeeList = () => {
  const [employees, setEmployee] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleSubmit = (values: Employee) => {
    fetch("https://dummyjson.com/users/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: values.firstname,
        lastName: values.lastname,
        email: values.email,
        age: values.age,
        gender: values.gender,
        address: values.address
      }),
    })
     .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
     .then((data) => {
        console.log(data);
        toast.success("User added Successfully.");
        setIsModalOpen(false);
      })
     .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
        toast.error("An error occurred");
      });
  };
  

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await getEmployees();
        setEmployee(data.users);
      } catch {
        console.log("Failed to Load Data!");
      }
    };
    fetchEmployee();
  }, []);

  return (
    <>
      <div>Employee list</div>
      <button
        type="submit"
        className="btn btn-primary"
        data-toggle="modal"
        data-target="#exampleModalCenter"
      >
        Add Employee
      </button>

      <>
        <div className="form-header">
          <h2>Employee Management</h2>
        </div>
        {isModalOpen && (
        <div
          className="modal fade"
          id="exampleModalCenter"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
          data-backdrop = 'false'
         
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header d-flex justify-content-between">
                <h5 className="modal-title" id="exampleModalLongTitle">
                  Add Employee
                </h5>
                <button
                  type="button"
                  className="close btn "
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <Container className="form-wrap">
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ errors, touched }) => (
                      <Form id = "upsert-user">
                        <div className="form-group mb-3">
                        <div className="form-label fw-bold">First name *</div>
                          <Field
                            name="firstname"
                            type="text"
                            className={`form-control ${
                              touched.firstname && errors.firstname
                                ? "is-invalid"
                                : ""
                            }`}
                            placeholder="Enter FirstName"
                          />
                          <ErrorMessage
                            name="firstname"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                        <div className="form-group mb-3">
                        <div className="form-label fw-bold">Last name *</div>
                          <Field
                            name="lastname"
                            type="text"
                            className={`form-control ${
                              touched.lastname && errors.lastname
                                ? "is-invalid"
                                : ""
                            }`}
                            placeholder="Enter LastName"
                          />
                          <ErrorMessage
                            name="lastname"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                        <div className="form-group mb-3">
                        <div className="form-label fw-bold">Email *</div>
                          <Field
                            name="email"
                            type="email"
                            className={`form-control ${
                              touched.email && errors.email ? "is-invalid" : ""
                            }`}
                            placeholder="Enter Email"
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                        <div className="form-group mb-3">
                        <div className="form-label fw-bold">Age *</div>
                          <Field
                            name="age"
                            type="text"
                            className={`form-control ${
                              touched.age && errors.age ? "is-invalid" : ""
                            }`}
                            placeholder="Enter Age"
                          />
                          <ErrorMessage
                            name="age"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                        <div className="form-group mb-3">
                        <div className="form-label fw-bold">Address *</div>
                          <Field
                            name="address"
                            type="text"
                            className={`form-control ${
                              touched.address && errors.address
                                ? "is-invalid"
                                : ""
                            }`}
                            placeholder="Enter address"
                          />
                          <ErrorMessage
                            name="address"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                        <div className="form-group mb-3">
                        <div className="form-label fw-bold">Gender *</div>
                          <div className="form-check">
                            <Field
                              type="radio"
                              name="gender"
                              value="male"
                              className="form-check-input"
                              id="male"
                            />
                            <label className="form-check-label" htmlFor="male">
                              Male
                            </label>
                          </div>
                          <div className="form-check">
                            <Field
                              type="radio"
                              name="gender"
                              value="female"
                              className="form-check-input"
                              id="female"
                            />
                            <label
                              className="form-check-label"
                              htmlFor="female"
                            >
                              Female
                            </label>
                          </div>
                          <div className="form-check">
                            <Field
                              type="radio"
                              name="gender"
                              value="other"
                              className="form-check-input"
                              id="other"
                            />
                            <label className="form-check-label" htmlFor="other">
                              Other
                            </label>
                          </div>
                          <ErrorMessage
                            name="gender"
                            component="div"
                            className="invalid-feedback"
                          />
                        </div>
                        <div className="add-btn">
                          <button type="submit" className="btn btn-primary">
                            Add Employee
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </Container>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* list of employees */}
        <div>
          <h2>Employees</h2>
          <ul>
            {employees.map((emp: any) => (
              <li key={emp.id}>{emp.firstName}</li>
            ))}
          </ul>
        </div>
      </>
    </>
  );
};
