import React from 'react';
import moment from 'moment';
import { LineChart, Line, AreaChart, Area, Brush, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function StockChart({ data, codes, colors }) {
  return (
    <div className="stock-chart">
      <ResponsiveContainer width={'100%'} height={'100%'}>
        <LineChart data={data} syncId="anyId"
              margin={{top: 10, right: 30, left: 0, bottom: 0}}>
          <XAxis
            dataKey="name"
            tickCount={11}
            tickFormatter={name => moment(name).format('MMM \'YY')}
            tick={{stroke: '#95a5a6', strokeWidth: 1}} />
          <YAxis/>
          <CartesianGrid strokeDasharray="2 6" vertical={false} stroke="#95a5a6"/>
          <Tooltip/>
          {codes.map((code, index) =>
            <Line type='linear' dot={false} dataKey={code} stroke={colors[index % colors.length]} key={index} />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StockChart;
