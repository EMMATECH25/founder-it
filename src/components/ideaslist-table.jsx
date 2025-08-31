import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Table, Input, InputNumber, message } from "antd";
import style from "../styles/idea-table-list.module.css";

const IdeaTableList = forwardRef((props, ref) => {
  // Initialize with 5 empty rows
  const [rows, setRows] = useState(
    Array.from({ length: 5 }, (_, i) => ({
      key: (i + 1).toString(),
      idea: "",
      solution: "",
      score: null,
    }))
  );

  const handleChange = (key, field, value) => {
    setRows((prev) =>
      prev.map((row) =>
        row.key === key ? { ...row, [field]: value } : row
      )
    );
  };

  // Expose validation + payload builder
  useImperativeHandle(ref, () => ({
    validateAndBuildPayload() {
      // Must have at least one complete row
      const filledRows = rows.filter(
        (r) => r.idea.trim() && r.solution.trim() && r.score
      );

      if (filledRows.length === 0) {
        message.error("Please fill at least one idea, solution, and score.");
        return null;
      }

      // Validate that if user starts filling, they must complete the row
      for (const r of rows) {
        if ((r.idea || r.solution || r.score) && !(r.idea && r.solution && r.score)) {
          message.error("All fields in a row must be filled if you start it.");
          return null;
        }
      }

      // Return payload for backend
      return {
        ideas: filledRows.map((r) => ({
          idea: r.idea,
          solution: r.solution,
          score: r.score,
        })),
      };
    },
  }));

  const columns = [
    {
      title: "IDEA / PROBLEM",
      dataIndex: "idea",
      render: (_, record) => (
        <Input
          value={record.idea}
          onChange={(e) => handleChange(record.key, "idea", e.target.value)}
          placeholder="Enter idea/problem"
        />
      ),
    },
    {
      title: "SOLUTION",
      dataIndex: "solution",
      render: (_, record) => (
        <Input
          value={record.solution}
          onChange={(e) => handleChange(record.key, "solution", e.target.value)}
          placeholder="Enter solution"
        />
      ),
    },
    {
      title: "RATE YOUR INTEREST (1-10)",
      dataIndex: "score",
      align: "center",
      render: (_, record) => (
        <InputNumber
          min={1}
          max={10}
          value={record.score}
          onChange={(val) => handleChange(record.key, "score", val)}
        />
      ),
    },
  ];

  return (
    <div className={style.container}>
      <Table
        columns={columns}
        dataSource={rows}
        pagination={false}
        rowKey="key"
      />
    </div>
  );
});

export default IdeaTableList;
