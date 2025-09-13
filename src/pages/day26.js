import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EvaluationTable from "../components/evaluation-table";
import TopNav from "../components/top-nav";
import ButtonNextPre from "../components/button-next-pre";
import TableBanner from "../components/activity-index/table-baner";
import Vid from "../assets/vid.png";
import style from "../styles/day3-16.module.css";
import style2 from "../styles/day26.module.css";
import TableTitle from "../components/day1/table-title";
import EditText from "../components/edittext";
import Footer from "../components/footer";

const Day26 = () => {
  const navigate = useNavigate();
  const [, setTableData] = useState({});

  const handlePrev = () => navigate("/day3-16");

  // 🔑 Handles both save & submit (local only for now)
  const handleAction = async (action) => {
    try {
      if (action === "save") {
        alert("Progress saved ");
      } else {
        alert("Submitted successfully ");
        navigate("/day27");
      }
    } catch (err) {
      console.error(err);
      alert(`Error during ${action}`);
    }
  };

  return (
    <div>
      <TopNav />
      <TableBanner
        title="28-DAY CHALLENGE"
        description="DAY 26"
        image={Vid}
        imageAlt="Challenge Preview"
        imageWidth={900}
      />
      <h2 className={style2.header}>WELCOME TO YOUR FIRST DAY</h2>
      <EditText message="We will now bring everything you’ve done together to integrate your skills, passions, interests, and selection criteria to establish for “founder fit” with a business idea. We will evaluate your fit by having you enter on a scale of 1-10 on the elements below:" />

      <div className={style2.btnDiv}>
        <button>Sample of a filled out form</button>
      </div>

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

      <TableTitle
        subtitle="Table 6"
        title="Evaluation of ideas against skills, passions, interest and selection criteria"
      />

      {/* Pass collected data upward */}
      <EvaluationTable onDataChange={setTableData} />

      <div className={style2.btnsDivs}>
        <div>
          <button className={style2.back} onClick={handlePrev}>
            BACK
          </button>
        </div>

        <ButtonNextPre
          buttons={[
            { label: "SAVE", onClick: () => handleAction("save") },
            { label: "SUBMIT", onClick: () => handleAction("submit") },
          ]}
        />
      </div>

      <Footer />
    </div>
  );
};

export default Day26;
