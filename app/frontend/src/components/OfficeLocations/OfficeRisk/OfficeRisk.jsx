import React, { useEffect, useState } from "react";
import { Select } from "antd";
import sortBy from "lodash/sortBy";
import uniqBy from "lodash/uniqBy";
// import { loadJSONData } from "../../helperfunctions/HelperFunctions";
const { Option } = Select;

const OfficeRisk = (props) => {
  const locations = props.locations.map((x) => x.work_location_postal_code);
  const trends = sortBy(
    props.trends.filter((x) => locations.includes(x.location)),
    "slope_data.slope"
  );

  // trends = trends;
  const [selectedLocation, setselectedLocation] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const labels = uniqBy(
    trends.map((x) => x.slope_data.risk),
    (e) => e.color + e.label
  ).reverse();

  function windowClick(event) {
    event.preventDefault();
    const riskdiv = document.getElementById("mainriskdiv");

    if (riskdiv && !riskdiv.contains(event.target)) {
      setShowDetails(false);
    }
  }

  useEffect(() => {
    // initiate the event handler
    window.addEventListener("click", windowClick, false);

    // this will clean up the event every time the component is re-rendered
    return function cleanup() {
      window.removeEventListener("click", windowClick, false);
    };
  }, []);

  const labelList = labels.map((data, i) => {
    const isLast = i === labels.length - 1;
    const locs = trends.filter((x) => x.slope_data.risk.color === data.color);
    const locList = locs.map((data, i) => {
      return (
        <div
          className="text-sm border p-1 pl-2 mb-1 cursor-pointer rounded-sm hover:bg-gray-100"
          key={"locrow" + i}
        >
          <div
            className={
              "w-2.5 h-2.5 inline-block mr-2 " +
              "bg-" +
              data.slope_data.risk.color +
              "-500"
            }
          >
            {" "}
          </div>
          {data.location}{" "}
        </div>
      );
    });
    return (
      <div
        className={"p3 flex-1 " + (isLast ? " " : " pr-3")}
        key={"labelrow" + i}
      >
        <div
          className={
            "p-1 pl-2 pr-2  text-white whitespace-nowrap font-semibold rounded-sm mb-2   " +
            "bg-" +
            data.color +
            "-500"
          }
        >
          {" "}
          {data.label} ({locs.length})
        </div>
        {showDetails && <div>{locList}</div>}
      </div>
    );
  });

  const trendList = trends.map((data, i) => {
    return (
      <div className="text-sm" key={"locrow" + i}>
        <div
          className={
            "w-2.5 h-2.5 inline-block mr-2 " +
            "bg-" +
            data.slope_data.risk.color +
            "-500"
          }
        >
          {" "}
        </div>
        {data.location}{" "}
      </div>
    );
  });

  function clickShowMore(e) {
    setShowDetails(!showDetails);
  }

  function divMouseLeave(e) {
    setShowDetails(false);
  }

  return (
    <>
      {trends.length > 0 && (
        <div
          id="mainriskdiv"
          // onMouseLeave={divMouseLeave}
          className={"relative w-max "}
        >
          <div className=" flex w-full bg-opacity-90  absolute p-3 pb-2  bg-white mb-4   ">
            {" "}
            <span className="font-semibold  pt-1 pb-0 flex-grow">
              {" "}
              Location Trend
            </span>
            <span
              onClick={clickShowMore}
              className="ml-3 p-2 rounded-sm hover:bg-gray-200 bg-gray-100x  border-gray-300 bg-white  text-xs      cursor-pointer"
            >
              {showDetails ? "< Hide Details" : "Show Details > "}
            </span>
          </div>
          {/* <span
            onClick={clickShowMore}
            className="absolute p-2   rounded-sm hover:bg-gray-100  border-gray-300 bg-white  right-3 top-3 text-xs   hover:underline   cursor-pointer"
          >
            {" "}
            {showDetails ? "< Hide Details" : "Show Details > "}
          </span> */}
          <div className="riskdiv overflow-auto mt-3 pt-14 bg-white   w-max  rounded-sm  bg-opacity-90    p-3 ">
            <div className="flex"> {labelList} </div>
          </div>

          <div className="bg-red-500 bg-green-500 bg-yellow-500 border-red-500  border-yellow-500 border-green-500"></div>
        </div>
      )}
    </>
  );
};

export default OfficeRisk;
