import { ChangeEvent, useEffect, useRef, useState } from "react";
import "./Employee-list.css";
import { IColumn } from "../models/column";
import AppTable from "./table";
import "./Employee-list.css";
import { toast } from "react-toastify";
import { ErrorMessage, Field, Form, Formik, useFormik } from "formik";
import { Container, Modal } from "react-bootstrap";
import * as Yup from "yup";
import { Employee } from "../models/Employee";

const columns: IColumn[] = [
  { viewValue: "Name", value: "firstName", sortable: true },
  { viewValue: "Email", value: "email", sortable: true },
  { viewValue: "Age", value: "age", sortable: true },
  { viewValue: "Gender", value: "gender", sortable: true },
  { viewValue: "Address", value: "address" },
];

const initialValues = {
  id: 0,
  firstName: "",
  lastName: "",
  email: "",
  age: 0,
  gender: "",
  address: "",
};

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("Firstname is required")
    .matches(/^[a-zA-Z\s]*$/, "Invalid firstname"),
  lastName: Yup.string()
    .required("Lastname is required")
    .matches(/^[a-zA-Z\s]*$/, "Invalid lastname"),
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

const EmployeeList = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [initialVal, setInitialVal] = useState<Employee>(initialValues);
  const [isAdd, setIsAdd] = useState<boolean>(true);

  useEffect(() => {
    fetch(
      "http://dummyjson.com/users/search?q=" +
        searchQuery +
        "&limit=" +
        pageSize +
        "&skip=" +
        page * pageSize +
        "&sortBy=" +
        sortConfig.key +
        "&order=" +
        sortConfig.direction
    )
      .then((res) => res.json())
      .then((res) => {
        setTotalRecords(res.total);
        const updatedData = res.users.map((data: any) => {
          return {
            ...data,
            firstName: data.firstName + " " + data.lastName,
            address: data.address.address,
          };
        });
        setUsers(updatedData);
      });
  }, [page, pageSize, searchQuery, sortConfig]);

  const onSearchEmployees = (event: ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setSearchQuery(event.target.value);
  };

  const onPageSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setPage(0);
    setPageSize(+event.target.value);
  };

  const onEditEmployee = (data: any) => {
    fetch("https://dummyjson.com/users/" + data.id, {
      method: "get",
    })
      .then((res) => res.json())
      .then((res) => {
        setInitialVal({
          id: res.id,
          firstName: res.firstName,
          lastName: res.lastName,
          email: res.email,
          age: res.age,
          address: res.address.address,
          gender: res.gender,
        });
        setIsAdd(false);
        setIsModalOpen(true);
      })
      .catch((err) => console.log);
  };

  const onDeleteEmployee = (data: any) => {
    fetch("https://dummyjson.com/users/" + data.id, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((res) =>
        toast.success(
          res.firstName + " " + res.lastName + " deleted Successfully."
        )
      )
      .catch((err) => console.log);
  };

  const onSortEmployees = (data: any) => {
    setSortConfig(data);
  };

  const handleSubmit = (values: Employee) => {
    if (isAdd) {
      fetch("https://dummyjson.com/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          age: values.age,
          gender: values.gender,
          address: values.address,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => {
          console.log(data);
          toast.success("User added Successfully.");
          setIsModalOpen(false);
          setUsers((employee) => {
            return [...employee, values];
          });
        })
        .catch((error) => {
          console.error(
            "There has been a problem with your fetch operation:",
            error
          );
          toast.error("An error occurred");
        });
    } else {
      fetch("https://dummyjson.com/users/" + values.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
        .then((res) => {
          res.json();
        })
        .then((res) => {
          toast.success("User edited Successfully.");
          setIsModalOpen(false);
        });
    }
  };

  return (
    <>
      <div className="container d-flex flex-column">
        <span className="h2 mt-3 heading text-center">Employee List</span>
        <div className="d-flex justify-content-end align-items-center mb-3">
          <div className="d-flex gap-3">
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search..."
              onChange={onSearchEmployees}
            />
            <button
              className="btn add-btn"
              onClick={() => {
                setIsModalOpen(true);
                setIsAdd(true);
                setInitialVal(initialValues);
              }}
            >
              <i className="bi bi-plus-lg"></i> Add Employee
            </button>
          </div>
        </div>
        <AppTable
          columns={columns}
          data={users}
          editable={true}
          deletable={true}
          onEdit={onEditEmployee}
          onDelete={onDeleteEmployee}
          onSort={onSortEmployees}
        />
        <div className="pagination mt-3 gap-3 justify-content-end align-items-center">
          <select
            className="form-select pagesize-select"
            onChange={onPageSizeChange}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
          <button
            className="btn "
            onClick={() => {
              setPage(0);
            }}
            disabled={page === 0}
          >
            <i className="bi bi-chevron-double-left"></i>
          </button>
          <button
            className="btn "
            onClick={() => {
              setPage((pageNumber) => pageNumber - 1);
            }}
            disabled={page === 0}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          {page + 1}
          <button
            className="btn "
            disabled={totalRecords <= pageSize * (page + 1)}
            onClick={() => {
              setPage((pageNumber) => pageNumber + 1);
            }}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
          <button
            className="btn "
            disabled={totalRecords <= pageSize * (page + 1)}
            onClick={() => {
              setPage(() => Math.floor(totalRecords / pageSize));
            }}
          >
            <i className="bi bi-chevron-double-right"></i>
          </button>
        </div>
      </div>
      <Modal
        show={isModalOpen}
        onHide={() => {
          setIsModalOpen(false);
        }}
      >
        <Formik
          initialValues={initialVal}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            handleSubmit(values);
            resetForm();
          }}
        >
          {({ errors, touched, resetForm }) => (
            <Form id="upsert-user">
              <Modal.Header closeButton>
                <Modal.Title>{isAdd ? "Add" : "Edit"} Employee</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Container className="form-wrap">
                  <div className="form-group mb-3">
                    <div className="form-label fw-bold">First name *</div>
                    <Field name="id" type="hidden" />
                    <Field
                      name="firstName"
                      type="text"
                      className={`form-control ${
                        touched.firstName && errors.firstName
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder="Enter First Name"
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="invalid-feedback"
                    />
                  </div>
                  <>{console.log(errors)}</>
                  <div className="form-group mb-3">
                    <div className="form-label fw-bold">Last name *</div>
                    <Field
                      name="lastName"
                      type="text"
                      className={`form-control ${
                        touched.lastName && errors.lastName ? "is-invalid" : ""
                      }`}
                      placeholder="Enter LastName"
                    />
                    <ErrorMessage
                      name="lastName"
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
                        touched.address && errors.address ? "is-invalid" : ""
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
                      <label className="form-check-label" htmlFor="female">
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
                  <div>
                    <button type="submit" className="btn btn-primary">
                      {isAdd ? "Add" : "Edit"} Employee
                    </button>
                  </div>
                </Container>
              </Modal.Body>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default EmployeeList;
