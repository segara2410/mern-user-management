import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import axios from 'axios';

const options = {
  scales: {
    yAxes: [{
      ticks: {
        min: 0,
        stepSize: 1
      }
    }]
  }
};

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      chartIsReady: false,
      chartData: {
        labels: [],
        datasets: [
          {
            label: 'User Count',
            lineTension: 0.1,
            borderColor: 'rgba(75,192,192,1)',
            data: []
          }
        ]
      },
    };
  }

  componentDidMount() {
    this.createChartIndexes();
    this.getUserCountData();
    this.getUserCountDataInterval = setInterval(this.getUserCountData.bind(this), 5000);
  }

  createChartIndexes() {
    const newChartData = this.state.chartData;
    for (let i = 1; i <= new Date().getDate(); i++) {
      newChartData.labels.push('' + i);
      newChartData.datasets[0].data.push(0);
    }
    this.setState({chartData: newChartData});
  }

  getUserCountData() {
    axios.get('/api/users/user-count').then(response => {
      const newChartData = this.state.chartData;
      response.data.forEach(responseData => {
        newChartData.datasets[0].data[responseData._id - 1] = responseData.count;
      });
      this.setState({chartData: newChartData, chartIsReady: true});

      if (this.reference)
      {
        let lineChart = this.reference.chartInstance;
        lineChart.update();
      }
      
    });
  }

  render() {
    return (
      <div className="container">
        <h2 className="mt-5 mb-3 text-center">Created User This Month</h2>
        {this.state.chartIsReady && <Line data={this.state.chartData} ref={(reference) => this.reference = reference} options={options}/>}
      </div>
    );
  }
}

export default Chart;
