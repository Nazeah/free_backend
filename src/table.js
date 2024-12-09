import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import "./table_styles.css";

const apiUrl = process.env.REACT_APP_API_URL;

function Table() {
  const [tableData, setTableData] = useState([
    [
      { value: "اليوم", isEditing: false },
      { value: "الفطور", isEditing: false },
      { value: "سناك 1", isEditing: false },
      { value: "الغداء", isEditing: false },
      { value: "سناك 2", isEditing: false },
      { value: "العشاء", isEditing: false },
    ],
  ]);
  const [allMeals, setAllMeals] = useState([]); // Store all meals from the backend
  const tableRef = useRef(); // Reference to the table element

  const columnOptions = ["الفطور", "سناك 1", "الغداء", "سناك 2", "العشاء"];
  const dayOptions = [
    "السبت",
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
  ];

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await axios.get(`${apiUrl}/meals`);
        setAllMeals(response.data);
      } catch (error) {
        console.error("Error fetching meals:", error);
      }
    };
    fetchMeals();
  }, []);

  const addRow = () => {
    setTableData((prevData) => [
      ...prevData,
      Array(prevData[0].length).fill({
        value: "",
        isEditing: false,
        additionalText: "",
      }),
    ]);
  };

  const addColumn = () => {
    setTableData((prevData) =>
      prevData.map((row) => [...row, { value: "", isEditing: false }])
    );
  };

  const deleteRow = (rowIndex) => {
    setTableData((prevData) =>
      prevData.filter((_, index) => index !== rowIndex + 1)
    );
  };

  const deleteColumn = (colIndex) => {
    setTableData((prevData) =>
      prevData.map((row) => row.filter((_, index) => index !== colIndex))
    );
  };

  const handleDayChange = (rowIndex, value) => {
    const newData = [...tableData];
    newData[rowIndex][0] = { ...newData[rowIndex][0], value, isEditing: false };
    setTableData(newData);
  };

  const handleAdditionalTextChange = (rowIndex, value) => {
    const newData = [...tableData];
    newData[rowIndex][0] = { ...newData[rowIndex][0], additionalText: value };
    setTableData(newData);
  };

  const handleHeaderChange = (colIndex, value) => {
    const newData = [...tableData];
    newData[0][colIndex] = { value, isEditing: false };
    setTableData(newData);
  };

  const handleCellChange = (rowIndex, colIndex, value) => {
    const newData = [...tableData];
    newData[rowIndex][colIndex] = { value, isEditing: false };
    setTableData(newData);
  };

  const toggleEditCell = (rowIndex, colIndex) => {
    const newData = [...tableData];
    newData[rowIndex][colIndex].isEditing =
      !newData[rowIndex][colIndex].isEditing;
    setTableData(newData);
  };

  const saveAdditionalText = (rowIndex) => {
    const newData = [...tableData];
    newData[rowIndex][0] = {
      ...newData[rowIndex][0],
      value: `${newData[rowIndex][0].value} - ${newData[rowIndex][0].additionalText}`,
      additionalText: "",
      isEditing: false,
    };
    setTableData(newData);
  };

  const getMealsForCategory = (category) => {
    return allMeals.filter((meal) => meal.category === category);
  };

  const calculateCaloriesSum = (row) => {
    return row.slice(1).reduce((sum, cell) => {
      const meal = allMeals.find((m) => m.name === cell.value);
      return meal ? sum + meal.calories : sum;
    }, 0);
  };

  const generateImage = () => {
    if (tableRef.current) {
      // Add a class to reduce the table width
      tableRef.current.classList.add("narrow-table");

      // Generate the image
      html2canvas(tableRef.current, {
        ignoreElements: (element) =>
          element.tagName === "BUTTON" ||
          element.classList.contains("calories-column"),
      }).then((canvas) => {
        // Create a download link for the generated image
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "table.png";
        link.click();

        // Remove the class to restore the original table width
        tableRef.current.classList.remove("narrow-table");
      });
    }
  };

  return (
    <div className="container">
      <div>
        <button onClick={addRow}>إضافة صف</button>
        <button onClick={addColumn}>إضافة عمود</button>
        <span className="photo-button">
          <button onClick={generateImage}>Downdload Photo</button>
        </span>
      </div>

      <div className="table-container" ref={tableRef}>
        <table>
          <thead>
            <tr>
              {tableData[0].map((header, index) => (
                <th
                  key={index}
                  style={{
                    width:
                      index === 0
                        ? "10%"
                        : header.value === "سناك 1" || header.value === "سناك 2"
                        ? "10%"
                        : "",
                  }}
                >
                  {!header.isEditing ? (
                    <>
                      {header.value}
                      {header.value !== "اليوم" && (
                        <button
                          className="edit-button"
                          style={{ marginLeft: "1px" }}
                          onClick={() => toggleEditCell(0, index)}
                        >
                          ✎
                        </button>
                      )}
                    </>
                  ) : (
                    <select
                      value={header.value}
                      onChange={(e) =>
                        handleHeaderChange(index, e.target.value)
                      }
                    >
                      <option value="">اختر...</option>
                      {columnOptions.map((option, i) => (
                        <option key={i} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                  {index > 0 && (
                    <button
                      className="delete-button"
                      onClick={() => deleteColumn(index)}
                    >
                      x
                    </button>
                  )}
                  {header.value !== "اليوم" && (
                    <div className="water-info">2 كوب ماء</div>
                  )}
                </th>
              ))}
              <th style={{ width: "5%" }} className="calories-column">
                مجموع السعرات الحرارية
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td>
                  {!row[0].isEditing ? (
                    <>
                      {row[0].value}
                      <button
                        className="edit-button"
                        onClick={() => toggleEditCell(rowIndex + 1, 0)}
                        style={{ marginLeft: "10px" }}
                      >
                        ✎
                      </button>
                    </>
                  ) : (
                    <>
                      <select
                        value={row[0].value}
                        onChange={(e) =>
                          handleDayChange(rowIndex + 1, e.target.value)
                        }
                      >
                        <option value="">اختر اليوم...</option>
                        {dayOptions.map((day, i) => (
                          <option key={i} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                      <br />
                      <input
                        type="text"
                        placeholder="نص إضافي"
                        value={row[0].additionalText}
                        onChange={(e) =>
                          handleAdditionalTextChange(
                            rowIndex + 1,
                            e.target.value
                          )
                        }
                      />
                      <button
                        className="save-button"
                        onClick={() => saveAdditionalText(rowIndex + 1)}
                        style={{ marginLeft: "10px" }}
                      >
                        حفظ
                      </button>
                    </>
                  )}
                  <button
                    className="delete-button"
                    onClick={() => deleteRow(rowIndex)}
                    style={{ marginLeft: "10px" }}
                  >
                    x
                  </button>
                </td>
                {row.slice(1).map((cell, colIndex) => (
                  <td
                    key={colIndex + 1}
                    style={{
                      width:
                        tableData[0][colIndex + 1].value === "سناك 1" ||
                        tableData[0][colIndex + 1].value === "سناك 2"
                          ? "10%"
                          : "",
                    }}
                  >
                    {cell && !cell.isEditing ? (
                      <>
                        {cell.value}
                        <button
                          className="edit-button"
                          onClick={() =>
                            toggleEditCell(rowIndex + 1, colIndex + 1)
                          }
                          style={{ marginLeft: "10px" }}
                        >
                          ✎
                        </button>
                      </>
                    ) : (
                      <select
                        value={cell.value || ""}
                        onChange={(e) =>
                          handleCellChange(
                            rowIndex + 1,
                            colIndex + 1,
                            e.target.value
                          )
                        }
                      >
                        <option value="">اختر الوجبة...</option>
                        {getMealsForCategory(
                          tableData[0][colIndex + 1].value
                        ).map((meal, i) => (
                          <option key={i} value={meal.name}>
                            {meal.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                ))}
                <td className="calories-column">{calculateCaloriesSum(row)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
