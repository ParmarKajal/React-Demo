import { Button, Modal, Table } from "react-bootstrap";
import { IColumn } from "../models/column";
import { FC, useState } from "react";
import "./table.css";
import MaleIcon from "../assets/ic-male.png";
import FemaleIcon from "../assets/ic-female.png";

interface TableProps {
  columns: IColumn[];
  data: any[];
  editable?: boolean;
  deletable?: boolean;
  onEdit?: (data: any) => void;
  onDelete?: (data: any) => void;
  onSort: (data: any) => void;
}

const AppTable: FC<TableProps> = ({
  columns,
  data,
  editable,
  deletable,
  onEdit,
  onDelete,
  onSort,
}) => {
  const [show, setShow] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<any>();
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSort = (column: IColumn) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === column.value && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: column.value, direction });
    onSort({ key: column.value, direction });
  };

  const getSortButton = (column: IColumn) => {
    if (sortConfig.key === column.value) {
      if (sortConfig.direction === "asc") {
        return "▲";
      } else {
        return "▼";
      }
    }
    return null;
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {selectedData?.firstName}.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={() => {
              if (onDelete) {
                handleClose();
                onDelete(selectedData);
              }
            }}
          >
            Delete
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.value}
                className={column.sortable ? "sortable" : ""}
                onClick={() => {
                  if (column.sortable) handleSort(column);
                }}
              >
                {column.viewValue} {column.sortable && getSortButton(column)}
              </th>
            ))}
            {(editable || deletable) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map((column) => (
                <td key={column.value}>
                  {column.value === "gender" ? (
                    <img
                      className="gender-img"
                      src={row[column.value] === "male" ? MaleIcon : FemaleIcon}
                    />
                  ) : (
                    row[column.value]
                  )}
                </td>
              ))}
              {(editable || deletable) && (
                <td className="d-flex gap-2 justify-content-center">
                  {editable && (
                    <button
                      className="btn px-2 py-1"
                      onClick={() => {
                        if (onEdit) {
                          onEdit(row);
                        }
                      }}
                    >
                      <i className="bi bi-pencil-square ic-edit"></i>
                    </button>
                  )}
                  {deletable && (
                    <button
                      className="btn px-2 py-1"
                      onClick={() => {
                        handleShow();
                        setSelectedData(row);
                      }}
                    >
                      <i className="bi bi-trash text-danger"></i>
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
      {data.length === 0 && (
        <div className="text-center">No records found.</div>
      )}
    </>
  );
};

export default AppTable;
