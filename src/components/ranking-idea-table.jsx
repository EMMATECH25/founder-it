import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import style from "../styles/idea-table-list.module.css";

const RankinkIdeaList = () => {
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "https://founderfit-backend.onrender.com/api/day3/get",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const data = await res.json();

        // ✅ backend sends ideas as JSON array
        setIdeas(data.data?.ideas || []);
      } catch (err) {
        console.error("❌ Failed to fetch ideas:", err);
        message.error("Failed to load your saved ideas.");
      }
    };

    fetchIdeas();
  }, []);

  const columns = [
    {
      title: "IDEA/PROBLEM",
      dataIndex: "idea",
    },
    {
      title: "SOLUTION",
      dataIndex: "solution",
    },
    {
      title: "INTEREST SCORE",
      dataIndex: "score",
      align: "center",
    },
  ];

  return (
    <div className={style.container}>
      <Table
        columns={columns}
        dataSource={ideas.map((item, index) => ({ ...item, key: index }))}
        pagination={false}
        rowKey="key"
      />
    </div>
  );
};

export default RankinkIdeaList;
