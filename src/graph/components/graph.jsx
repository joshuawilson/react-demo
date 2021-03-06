import React, { Component } from 'react';
import * as d3 from 'd3';
import * as webcola from 'webcola';

/*
const Graph = (props) => {
  useEffect(() => {
    // d3.select('.topo > *').remove();
    draw(props)
  });
  return <div className="topo"/>
};
*/

export default class Graph extends Component {
  componentDidMount() {
    draw(this.props);
  }
  componentDidUpdate() {
    draw(this.props);
  }
  render() {
    return (
      <div className="topo"/>
    )
  }
}

const draw = (props) => {

  const width = props.width;
  const height = props.height;

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const cola = webcola.d3adaptor(d3)
    .linkDistance(80)
    .avoidOverlaps(true)
    .handleDisconnected(false)
    .size([width, height]);

  const svg = d3.select(".topo").append("svg")
    .attr("width", width)
    .attr("height", height);

  const graph = props.graph;

  graph.nodes.forEach(function (v) {
    v.width = v.height = 95;
  });

  graph.groups.forEach(function (g) { g.padding = 0.01; });

  cola
    .nodes(graph.nodes)
    .links(graph.links)
    .groups(graph.groups)
    .start(100, 0, 50, 50);

  const group = svg.selectAll(".group")
    .data(graph.groups)
    .enter().append("rect")
    .attr("rx", 8).attr("ry", 8)
    .attr("class", "group")
    .style("fill", function (d, i) { return color(i); });

  const link = svg.selectAll(".link")
    .data(graph.links)
    .enter().append("line")
    .attr("class", "link");

  const pad = 20;
  const node = svg.selectAll(".node")
    .data(graph.nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", function (d) { return d.width - 3 * pad; })
    // .attr("height", function (d) { return d.height - 2 * pad; })
    // .attr("rx", 5).attr("ry", 5)
    .style('stroke', 'green')
    .style('stroke-width', 8)
    .style('fill', 'white')
    .style('fill-opacity', 1)
    .call(cola.drag)
    .on('mouseup', function (d) {
      d.fixed = 0;
      cola.alpha(1); // fire it off again to satify gridify
    });

  const label = svg.selectAll(".label")
    .data(graph.nodes)
    .enter().append("text")
    .attr("class", "label")
    .style('fill', 'black')
    .text(function (d) { return d.name; })
    .call(cola.drag);

  node.append("title")
    .text(function (d) { return d.name; });

  cola.on("tick", function () {
    link.attr("x1", function (d) { return d.source.x; })
      .attr("y1", function (d) { return d.source.y; })
      .attr("x2", function (d) { return d.target.x; })
      .attr("y2", function (d) { return d.target.y; });

    node.attr("cx", function (d) { return d.x; })
      .attr("cy", function (d) { return d.y; });

    group.attr("x", function (d) { return d.bounds.x; })
      .attr("y", function (d) { return d.bounds.y; })
      .attr("width", function (d) { return d.bounds.width(); })
      .attr("height", function (d) { return d.bounds.height(); });

    label.attr("x", function (d) { return d.x; })
      .attr("y", function (d) {
        const h = this.getBBox().height;
        return d.y + h/4;
      });
  });
};
