import React, { useEffect } from 'react';
import * as d3 from 'd3';
import draw from '../../d3/topology';

const Graph = (props) => {
  useEffect(() => {
    d3.select('.topo > *').remove();
    draw(props)
  }, [props.shapes.length]);
  return <div className="topo" />
};
