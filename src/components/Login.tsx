import React, { useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./Login.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const history = useNavigate();

  const initialValues = {
    username: "",
    password: "",
  };

  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: values.username,
        password: values.password,
        expiresInMins: 30,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          toast.success("Login Successfully.");
          history("/employee-list");
        } else {
          toast.error("Username or Password incorrect.");
        }
      });
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
    //   .matches(
    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$%*?&])[A-Za-z\d@$%*?&]{8,}$/,
    //     "Must contain at least one lowercase, uppercase, digit, special character, and be at least 8 characters long"
    //   ),
  });

  return (
    <div className="d-flex justify-content-center align-items-center login-container ">
      <div className="card col-lg-3 col-md-8 col-sm-8 p-4 border rounded-border">
        <h2 className="text-center pb-4">Sign In</h2>
        {
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form>
                <div className="mb-3">
                  <div className="form-label fw-bold">Username *</div>
                  <Field
                    id="username"
                    name="username"
                    className={`form-control rounded-pill ${
                      touched.username && errors.username
                        ? "border border-danger"
                        : ""
                    }`}
                    placeholder="Enter username"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="error-message"
                  />
                </div>

                <div className="mb-3">
                  <div className="form-label fw-bold">Password *</div>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className={`form-control rounded-pill ${
                      touched.password && errors.password
                        ? "border border-danger"
                        : ""
                    }`}
                    placeholder="Enter password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="error-message"
                  />
                </div>
                <button
                  className="btn sign-in-button w-100 rounded-pill text-uppercase py-3 fw-bold"
                  type="submit"
                >
                  sign in
                </button>
              </Form>
            )}
          </Formik>
        }
      </div>
    </div>
  );
};

export default Login;
