// components/questionwithoptions.js
import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Checkbox, Input, message } from "antd";
import style from "../styles/questionwithoption.module.css";

const QuestionWithOptions = forwardRef((props, ref) => {
  const [selectionCriteria, setSelectionCriteria] = useState([]);
  const [customOther, setCustomOther] = useState("");

  const [location, setLocation] = useState([]);
  const [scalability, setScalability] = useState([]);
  const [riskTolerance, setRiskTolerance] = useState([]);
  const [timeCommitment, setTimeCommitment] = useState([]);
  const [investment, setInvestment] = useState([]);

  // Limit 2 selections for first section
  const handleSelectionCriteriaChange = (values) => {
    if (values.length > 2) {
      message.error("You can only select 2 options in this section.");
      return;
    }
    setSelectionCriteria(values);
    if (!values.includes("Other")) setCustomOther("");
  };

  // Limit 1 selection for all other sections
  const handleSingleSelect = (setter) => (values) => {
    if (values.length > 1) {
      message.error("You can only select 1 option here.");
      return;
    }
    setter(values);
  };

  // Expose validation + payload to parent
  useImperativeHandle(ref, () => ({
    validateAndBuildPayload() {
      if (selectionCriteria.length !== 2) {
        message.error("Please select exactly 2 options in 'Selection Criteria'.");
        return null;
      }
      if (
        !location.length ||
        !scalability.length ||
        !riskTolerance.length ||
        !timeCommitment.length ||
        !investment.length
      ) {
        message.error("Please select 1 option in each section.");
        return null;
      }

      return {
        selectionCriteria: selectionCriteria.includes("Other")
          ? [...selectionCriteria.filter((v) => v !== "Other"), customOther]
          : selectionCriteria,
        location: location[0],
        scalability: scalability[0],
        riskTolerance: riskTolerance[0],
        timeCommitment: timeCommitment[0],
        investment: investment[0],
      };
    },
  }));

  return (
    <div className={style.container}>
      {/* ✅ Section 1 */}
      <div className={style.checkBoxText}>
        <h3>Defining Your Selection Criteria – What do you want?</h3>
        <Checkbox.Group
          style={{ width: "100%" }}
          onChange={handleSelectionCriteriaChange}
          value={selectionCriteria}
        >
          <div className={style.blockCheck}>
            <Checkbox value="Freedom / Flexibility">Freedom / Flexibility</Checkbox>
            <Checkbox value="Wealth">Wealth</Checkbox>
            <Checkbox value="Impact">Impact</Checkbox>
            <Checkbox value="Self Actualization">Self Actualization</Checkbox>
            <Checkbox value="Other">Other</Checkbox>
            {selectionCriteria.includes("Other") && (
              <Input
                placeholder="Please specify..."
                value={customOther}
                onChange={(e) => setCustomOther(e.target.value)}
                className={style.otherInput}
              />
            )}
          </div>
        </Checkbox.Group>
      </div>

      {/* ✅ Section 2 */}
      <div className={style.checkBoxText}>
        <h3>The location of the business</h3>
        <Checkbox.Group
          style={{ width: "100%" }}
          onChange={handleSingleSelect(setLocation)}
          value={location}
        >
          <div className={style.blockCheck}>
            <Checkbox value="No location">No location</Checkbox>
            <Checkbox value="In the Area">In the Area (permanence not required)</Checkbox>
            <Checkbox value="Fixed Location">Fixed Location</Checkbox>
          </div>
        </Checkbox.Group>
      </div>

      {/* ✅ Section 3 */}
      <div className={style.checkBoxText}>
        <h3>Scalability requirement is</h3>
        <Checkbox.Group
          style={{ width: "100%" }}
          onChange={handleSingleSelect(setScalability)}
          value={scalability}
        >
          <div className={style.blockCheck}>
            <Checkbox value="Lifestyle">Supporting my lifestyle</Checkbox>
            <Checkbox value="Stable Growth">Stable cash flow; some growth</Checkbox>
            <Checkbox value="High Growth">High Growth</Checkbox>
          </div>
        </Checkbox.Group>
      </div>

      {/* ✅ Section 4 */}
      <div className={style.checkBoxText}>
        <h3>Risk tolerance is</h3>
        <Checkbox.Group
          style={{ width: "100%" }}
          onChange={handleSingleSelect(setRiskTolerance)}
          value={riskTolerance}
        >
          <div className={style.blockCheck}>
            <Checkbox value="Low">Low</Checkbox>
            <Checkbox value="Medium">Medium</Checkbox>
            <Checkbox value="High">High</Checkbox>
          </div>
        </Checkbox.Group>
      </div>

      {/* ✅ Section 5 */}
      <div className={style.checkBoxText}>
        <h3>Required time commitment</h3>
        <Checkbox.Group
          style={{ width: "100%" }}
          onChange={handleSingleSelect(setTimeCommitment)}
          value={timeCommitment}
        >
          <div className={style.blockCheck}>
            <Checkbox value="Full time">Full time</Checkbox>
            <Checkbox value="Part time">Part time</Checkbox>
            <Checkbox value="Evenings/Weekends">Evening/weekends</Checkbox>
            <Checkbox value="Adhoc">Adhoc</Checkbox>
          </div>
        </Checkbox.Group>
      </div>

      {/* ✅ Section 6 */}
      <div className={style.checkBoxText}>
        <h3>Money to be invested</h3>
        <Checkbox.Group
          style={{ width: "100%" }}
          onChange={handleSingleSelect(setInvestment)}
          value={investment}
        >
          <div className={style.blockCheck}>
            <Checkbox value="No money">No money</Checkbox>
            <Checkbox value="Some money">Some money</Checkbox>
            <Checkbox value="Other people's money">Other people's money</Checkbox>
            <Checkbox value="Self-funded">Self-funded</Checkbox>
          </div>
        </Checkbox.Group>
      </div>
    </div>
  );
});

export default QuestionWithOptions;
