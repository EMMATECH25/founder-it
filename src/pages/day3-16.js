// pages/Day316.js
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import TopNav from "../components/top-nav";
import TableBanner from "../components/activity-index/table-baner";
import Vid from "../assets/vid.png";
import style from "../styles/day3-16.module.css";
import InstructionSteps from "../components/instruction-step";
import TableTitle from "../components/day1/table-title";
import IdeaTableList from "../components/ideaslist-table";
import Footer from "../components/footer";
import ButtonNextPre from "../components/button-next-pre";

const Day316 = () => {
  const navigate = useNavigate();
  const ideaTableRef = useRef();

  const handlePrev = () => navigate("/day2");

  const handleNext = async () => {
    const payload = ideaTableRef.current.validateAndBuildPayload();
    if (!payload) return; // validation failed

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://founderfit-backend.onrender.com/api/day3/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error(`Server responded with ${response.status}`);

      message.success("Day3–16 responses saved successfully!");
      navigate("/day17-25");
    } catch (err) {
      console.error("❌ Failed to save Day3–16 responses:", err);
      message.error("Failed to save your responses. Try again.");
    }
  };

  return (
    <div>
      <TopNav />
      <TableBanner
        title="28-DAY CHALLENGE"
        description="DAY 3-16"
        image={Vid}
        imageAlt="Challenge Preview"
        imageWidth={900}
      />

      <InstructionSteps
        title="Welcome to your first day!"
        step1="This is a multi-day exercise where you are actively looking for potential business ideas. Identify the problems you identify and detail the solution you propose."
        step2="Developing and refining your ideas will take time so DON’T rush things; allow yourself ample time for this process"
        step3="Following the ideation process, assign a number to the interest you have in pursuing this idea; where “1” is “least interested” and “10” is “most interested”"
      />

      <div className={style.helpButtonDiv}>
        <div className={style.help}>
          <div className={style.emptyDiv}></div>
          <p>HELP</p>
          <div className={style.emptyDiv}></div>
        </div>
        <div className={style.helpButton}>
          <button className={style.BtnHelp}>Sample of a filled out form</button>
          <button className={style.BtnHelp}>
            Use an AI tool to help you get started
          </button>
        </div>
      </div>

      <TableTitle subtitle="Table 4" title="LISTING IDEAS AND EVALUATION" />

      {/* ✅ Pass ref so parent can validate/save */}
      <IdeaTableList ref={ideaTableRef} />

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

export default Day316;
