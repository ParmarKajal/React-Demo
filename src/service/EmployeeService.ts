import { Employee } from "../models/Employee";

const API_URL = "http://dummyjson.com/";

export const getEmployees = async () => {
  try {
    const response = await fetch(`${API_URL}users`);
    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const addEmployee = async (employeeData: Employee) => {
  try {
    const response = await fetch(`${API_URL}users/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employeeData),
    });

    if (!response.ok) {
      throw new Error("Failed to add user");
    }

    return await response.json();
  } catch (error) {}
};
