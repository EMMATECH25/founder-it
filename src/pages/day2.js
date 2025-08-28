// pages/Day2.js
import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import TopNav from "../components/top-nav";
import QuestionWithOptions from "../components/questionwithoptions";
import TableTitle from "../components/day1/table-title";
import TableBanner from "../components/activity-index/table-baner";
import Vid from "../assets/vid.png";
import EditText from "../components/edittext";
import style from "../styles/day2.module.css";
import Footer from "../components/footer";
import ButtonNextPre from "../components/button-next-pre";

// 🔹 Backend API root
const API_BASE = "https://founderfit-backend.onrender.com/api";

const Day2 = () => {
  const navigate = useNavigate();
  const questionRef = useRef();
  const [initialData, setInitialData] = useState(null);

  const handlePrev = () => navigate("/day1-part1");

  const handleNext = async () => {
    const payload = questionRef.current.validateAndBuildPayload();
    if (!payload) return; // stop if validation failed

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_BASE}/day2/save`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success("✅ Responses saved successfully!");
      navigate("/day3-16");
    } catch (err) {
      console.error("❌ Failed to save Day2 responses:", err);
      message.error("Failed to save your responses. Try again.");
    }
  };

  // 🔹 Fetch existing responses on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/day2/get`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data) {
          setInitialData(res.data);
        }
      } catch (err) {
        console.warn("⚠️ No previous Day2 data found or failed to load:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <TopNav />
      <TableBanner
        title="28-DAY CHALLENGE"
        description="DAY2"
        image={Vid}
        imageAlt="Challenge Preview"
        imageWidth={900}
      />
      <EditText
        message="Today you will define your selection criteria and carefully consider your personal and professional goals. To make informed decisions use your responses from Day 2 to guide you through this process. Define your selection criteria for a business below."
      />

      <div className={style.help}>
        <div className={style.emptyDiv}></div>
        <p>HELP</p>
        <div className={style.emptyDiv}></div>
      </div>

      <div className={style.btnDiv}>
        <button>Sample of a filled out form</button>
      </div>

      <TableTitle subtitle="Table 3" title="Defining selection criteria" />

      {/* ✅ Pass ref + prefill data */}
      <QuestionWithOptions ref={questionRef} initialData={initialData} />

      <div className={style.btnContainer}>
        <ButtonNextPre
          buttons={[
            { label: "PREVIOUS", onClick: handlePrev },
            { label: "NEXT", onClick: handleNext },
          ]}
        />
      </div>

      <Footer />
    </div>
  );
};

export default Day2;
