import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Logo from "../assets/logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";
import Spinner from "../Components/Spinner";
import axios from "axios";

const Register = () => {
  const url = "http://127.0.0.1:8000/api/auth/register";

  const navigate = useNavigate();
  const [loader, setLoader] = useState("none");
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const toastOptions = {
    position: "top-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) {
      navigate("/login_user");
    }
  });

  const handleInputs = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, fullName, email } = user;
    if (password !== confirmPassword) {
      toast.error(
        "password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (fullName.length <= 2) {
      toast.error("Enter your full name", toastOptions);
      return false;
    } else if (password.length < 6) {
      toast.error("Password should be greater than 6 character", toastOptions);
      return false;
    } else if (email === "") {
      toast.error("Email is required", toastOptions);
      return false;
    }
    return true;
  };

  const PostData = async (e) => {
    e.preventDefault();
    const { fullName, email, password, } = user;
    const requestOptions = {
      // if key and values are same then dont write it again eg -> name: name
      fullName,
      email,
      password,
    };
    console.log(requestOptions);

    if (handleValidation()) {
      setLoader("flex");
      // const res = await axios.post(url, JSON.stringify(requestOptions));
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestOptions),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 422) {
          // Validation errors
          const errors = data.errors;
          Object.keys(errors).forEach((key) => {
            errors[key].forEach((error) => {
              toast.error(error, {
                position: toast.POSITION.TOP_RIGHT,
              });
            });
          });
        } else {
          // Other errors
          toast.error('An error occurred', {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      } else {
        // Post was successful
        toast.success(data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
      
      if (data) {
        setLoader("none");
      }
      console.log(data);
      toast.error(data.error, toastOptions);
      toast.error(data.message, toastOptions);

      if (data.message === "user registered successfully") {
        toast.success(data.message, toastOptions);
        localStorage.setItem("chat-app-user", user);
        navigate("/login_user");
      }
    }
  };

  return (
    <>
      <div className="register_form_section">
        <FormContainer className="form_container_register">
          <form
            className="register_u_form"
            method="POST"
            onSubmit={PostData}
            data-aos="fade-right"
          >
            <div className="brand">
              <img src={Logo} alt="logo" />
              <h1>Om Dental Clinic</h1>
            </div>
            <input
              type="text"
              placeholder="Enter Your Name"
              name="fullName"
              value={user.fullName}
              onChange={handleInputs}
              autoComplete="off"
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={user.email}
              onChange={handleInputs}
              autoComplete="off"
            />
            <input
              type="Password"
              placeholder="Password"
              name="password"
              value={user.password}
              onChange={handleInputs}
              autoComplete="off"
            />
            <input
              type="Password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={user.confirmPassword}
              onChange={handleInputs}
              autoComplete="off"
            />
            <button className="submit_register_btn" type="submit">
              Sign Up
              <Spinner id="rg_loder" style={loader} />
            </button>
            <span className="lower_title_register">
              Already have an account ?<Link to="/login_user">Login</Link>
            </span>
          </form>
        </FormContainer>
        <ToastContainer />
      </div>
    </>
  );
};

const FormContainer = styled.div``;

export default Register;
