import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getProjectStatusSummary } from "../api/service";

ChartJS.register(ArcElement, Tooltip, Legend);

const ChartComponent = () => {
  const [chartData, setChartData] = useState(null);

  // console.log("chartData", chartData);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getProjectStatusSummary();
        const labels = data.map((item) => item._id);
        const values = data.map((item) => item.count);
        setChartData({
          labels,
          datasets: [
            {
              label: "Project Status",
              data: values,
              backgroundColor: [
                "#4CAF50",
                "#FF9800",
                "#2196F3",
                "#fe777b",
                "#556CD6",
              ],
              hoverOffset: 6,
            },
          ],
        });
      } catch (error) {
        console.error("Failed to fetch project summary", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="text-center">
      <h2 className="text-lg font-bold mb-4">Project Status</h2>
      <div className="h-[220px]">
        {chartData ? <Doughnut data={chartData} /> : <p>Loading chart...</p>}
      </div>
    </div>
  );
};

export default ChartComponent;
