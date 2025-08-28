// pages/Day2.js
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
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

const Day2 = () => {
  const navigate = useNavigate();
  const questionRef = useRef();

  const handlePrev = () => navigate("/day1-part1");

  const handleNext = async () => {
    const payload = questionRef.current.validateAndBuildPayload();
    if (!payload) return; // validation failed, stop

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("https://founderfit-backend.onrender.com/api/day2/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      message.success("Responses saved successfully!");
      navigate("/day3-16");
    } catch (err) {
      console.error("❌ Failed to save Day2 responses:", err);
      message.error("Failed to save your responses. Try again.");
    }
  };

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

      {/* ✅ Pass ref so we can validate on Next */}
      <QuestionWithOptions ref={questionRef} />

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
