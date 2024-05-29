import { ChangeEvent, useEffect, useRef, useState } from "react";
import "./Employee-list.css";
import { IColumn } from "../models/column";
import AppTable from "./table";
import "./Employee-list.css";
import { toast } from "react-toastify";

const columns: IColumn[] = [
  { viewValue: "Name", value: "firstName", sortable: true },
  { viewValue: "Email", value: "email", sortable: true },
  { viewValue: "Age", value: "age", sortable: true },
  { viewValue: "Gender", value: "gender", sortable: true },
  { viewValue: "Address", value: "address" },
];

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
    console.log(data);
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
            <button className="btn add-btn">
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
    </>
  );
};

export default EmployeeList;
