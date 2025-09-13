import { useState, useEffect } from "react";
import { Table, InputNumber, Divider, message } from "antd";
import style from "../styles/idea-table-list.module.css";

// Part 1 Data (still static for now)
const dataPart1 = [
  { key: "1", skills: "Product" },
  { key: "2", skills: "Sales" },
  { key: "3", skills: "Sector experience/understanding" },
  { key: "4", skills: "Technology" },
  { key: "5", skills: "Relatioships" },
  { key: "6", skills: "Distribution" },
  { key: "7", skills: "Capital" },
  { key: "8", skills: "Legal/Compliance" },
  { key: "9", skills: "Competetive Positioning" },
  { key: "10", skills: "Management" },
];

const EvaluationTable = ({ onDataChange }) => {
  const [inputs, setInputs] = useState({});
  const [dataPart2, setDataPart2] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Part 2 data from backend (Day2 selections)
  useEffect(() => {
    const fetchPart2Data = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(
          "https://founderfit-backend.onrender.com/api/day2/get",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const json = await res.json();

        const formatted = [];
        if (json.data) {
          if (Array.isArray(json.data.selection_criteria)) {
            json.data.selection_criteria.forEach((crit, idx) => {
              formatted.push({ key: `crit-${idx}`, skills: crit });
            });
          }
          formatted.push({
            key: "location",
            skills: `Location: ${json.data.location}`,
          });
          formatted.push({
            key: "scalability",
            skills: `Scalability: ${json.data.scalability}`,
          });
          formatted.push({
            key: "risk",
            skills: `Risk tolerance: ${json.data.risk_tolerance}`,
          });
          formatted.push({
            key: "time",
            skills: `Time commitment: ${json.data.time_commitment}`,
          });
        }

        setDataPart2(formatted);
      } catch (error) {
        console.error("Failed to fetch Part 2 data:", error);
        message.error("Failed to load selection criteria.");
      } finally {
        setLoading(false);
      }
    };

    fetchPart2Data();
  }, []);

  // ✅ Handle input updates
  const handleInputChange = (key, field, value, partType) => {
    setInputs((prev) => {
      const updated = {
        ...prev,
        [key]: {
          ...prev[key],
          [field]: Number(value) || 0,
        },
      };

      const needs = updated[key]?.needs || 0;
      const have = updated[key]?.have || 0;

      if (partType === 1) {
        updated[key].gap = Math.max(needs - have, 0);
      } else if (partType === 2) {
        updated[key].gap = Math.max(have - needs, 0);
      }

      // 🔑 Bubble up to parent (Day26)
      onDataChange && onDataChange(updated);

      return updated;
    });
  };

  const getTotal = (field, keys) => {
    return keys.reduce((sum, key) => sum + (inputs[key]?.[field] || 0), 0);
  };

  const keysPart1 = dataPart1.map((item) => item.key);
  const keysPart2 = dataPart2.map((item) => item.key);

  // 💡 Columns generator (accepts partType for logic)
  const makeColumns = (title, partType) => [
    {
      title,
      dataIndex: "skills",
    },
    {
      title: "NEEDS",
      key: "needs",
      align: "center",
      render: (_, record) => (
        <InputNumber
          min={0}
          max={10}
          value={inputs[record.key]?.needs}
          onChange={(val) =>
            handleInputChange(record.key, "needs", val, partType)
          }
        />
      ),
    },
    {
      title: "I HAVE",
      key: "have",
      align: "center",
      render: (_, record) => (
        <InputNumber
          min={0}
          max={10}
          value={inputs[record.key]?.have}
          onChange={(val) =>
            handleInputChange(record.key, "have", val, partType)
          }
        />
      ),
    },
    {
      title: "GAP",
      key: "gap",
      align: "center",
      render: (_, record) => <strong>{inputs[record.key]?.gap || 0}</strong>,
    },
  ];

  return (
    <div className={style.container}>
      <h3>Part 1</h3>
      <Table
        columns={makeColumns(
          "CAPABILITIES ASSESMENT SKILLS REQUIRED FOR IDEA TO SUCCEED",
          1
        )}
        dataSource={dataPart1}
        pagination={false}
        rowKey="key"
        scroll={{ x: 600 }}
        className={style.responsiveTable}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell colSpan={2}>
              <strong>Subtotal</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center">
              <strong>{getTotal("needs", keysPart1)}</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center">
              <strong>{getTotal("have", keysPart1)}</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center">
              <strong>{getTotal("gap", keysPart1)}</strong>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />

      <Divider />

      <h3>Part 2</h3>
      <Table
        loading={loading}
        columns={makeColumns(
          "FIT ASSESSMENT Things I Want vs What Idea Offers",
          2
        )}
        dataSource={dataPart2}
        pagination={false}
        rowKey="key"
        scroll={{ x: 600 }}
        className={style.responsiveTable}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell colSpan={2}>
              <strong>Subtotal</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center">
              <strong>{getTotal("needs", keysPart2)}</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center">
              <strong>{getTotal("have", keysPart2)}</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell align="center">
              <strong>{getTotal("gap", keysPart2)}</strong>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />

      <Divider />

      <h3>Overall Total</h3>
      <Table
        columns={[
          {
            title: "Total of All Sections",
            colSpan: 2,
            render: () => <strong>Total</strong>,
          },
          {},
          {
            title: "Total NEEDS",
            render: () => (
              <strong>{getTotal("needs", [...keysPart1, ...keysPart2])}</strong>
            ),
            align: "center",
          },
          {
            title: "Total I HAVE",
            render: () => (
              <strong>{getTotal("have", [...keysPart1, ...keysPart2])}</strong>
            ),
            align: "center",
          },
          {
            title: "Total GAP",
            render: () => (
              <strong>{getTotal("gap", [...keysPart1, ...keysPart2])}</strong>
            ),
            align: "center",
          },
        ]}
        dataSource={[{}]}
        pagination={false}
        showHeader={false}
        scroll={{ x: 600 }}
        className={style.responsiveTable}
      />
    </div>
  );
};

export default EvaluationTable;
