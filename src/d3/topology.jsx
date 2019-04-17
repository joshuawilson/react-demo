import React, { useEffect } from 'react';
import * as d3 from 'd3';

const Graph = (props) => {
  useEffect(() => {
    // d3.select('.topo > *').remove();
    draw(props)
  });
  return <div className="topo" />
};

const draw = (props) => {

  const links = props.graph.links.map(d => Object.create(d));
  const nodes = props.graph.nodes.map(d => Object.create(d));

  // const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  // const h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  const w = props.width;
  const h = props.height;

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const drag = simulation => {

    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };

  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(w / 2, h / 2));

  const svg = d3.select('.topo').append('svg')
    .attr('height', h)
    .attr('width', w)
    .attr('id', 'svg-topo');


  const link = svg.append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", d => Math.sqrt(d.value));

  const node = svg.append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", 5)
    .attr("fill", d => color(d.group))
    .call(drag(simulation));

  node.append("title")
    .text(d => d.id);

  simulation.on("tick", () => {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
  });

  // invalidation.then(() => simulation.stop());
};

export default Graph;