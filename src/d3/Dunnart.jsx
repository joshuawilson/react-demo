import React, {useEffect} from 'react';
import * as d3 from 'd3';

const Graph = (props) => {
  useEffect(() => {
    // d3.select('.topo > *').remove();
    draw(props)
  });
  return <div className="topo"/>
};

const draw = (props) => {

  const links = props.graph.links.map(d => Object.create(d));
  const nodes = props.graph.nodes.map(d => Object.create(d));

  // const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  // const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  const width = props.width;
  const height = props.height;

  var d3cola = cola.d3adaptor(d3)
    .linkDistance(60)
    .avoidOverlaps(true)
    .size([width, height]);

  var outer = d3.select("topo").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("pointer-events", "all");

  outer.append('rect')
    .attr('class', 'background')
    .attr('width', "100%")
    .attr('height', "100%")
    .call(d3.behavior.zoom().on("zoom", redraw));

  var vis = outer
    .append('g')
    .attr('transform', 'translate(80,80) scale(0.7)');

  function redraw() {
    vis.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
  }

  var groupsLayer = vis.append("g");
  var nodesLayer = vis.append("g");
  var linksLayer = vis.append("g");

  var graph = {}, nodeLookup = {};

  function parseDunnart() {
    var sbsvg = d3.select(document.getElementById("embeddedsvg").contentDocument).select('svg');
    graph.nodes = [];
    sbsvg.selectAll('rect.shape').each(function (d, i) {
      graph.nodes.push(
        nodeLookup[this.id] = {
          label: this.attributes['dunnart:label'].value,
          dunnartid: this.id,
          index: i,
          width: 60,
          height: 40,
          x: parseFloat(this.attributes['x'].value),
          y: parseFloat(this.attributes['y'].value),
          rx: ('rx' in this.attributes) ? parseFloat(this.attributes['rx'].value) : 5,
          ry: ('ry' in this.attributes) ? parseFloat(this.attributes['ry'].value) : 5
        }
      );
    });
    graph.links = sbsvg.selectAll('.connector')[0].map(function (l) {
      return {
        source: nodeLookup[l.attributes['dunnart:srcID'].value].index,
        target: nodeLookup[l.attributes['dunnart:dstID'].value].index
      }
    });
    graph.groups = sbsvg.selectAll('.cluster')[0].map(function (g) {
      return {
        leaves: g.attributes['dunnart:contains'].value.split(' ').map(function (i) {
          return nodeLookup[i].index
        }),
        style: g.attributes['style'].value,
        padding: 10
      }
    });
    graph.constraints = [];
    var constraintMap = {};
    sbsvg.selectAll('[relType=alignment]').each(function () {
      var cid = this.attributes['constraintID'].value;
      var nodeid = nodeLookup[this.attributes['objOneID'].value].index;
      var alignmentPos = this.attributes['alignmentPos'].value;
      var o = {node: nodeid, offset: 0};
      if (cid in constraintMap) {
        constraintMap[cid].offsets.push(o);
      } else {
        graph.constraints.push(constraintMap[cid] = {
          type: 'alignment',
          offsets: [o],
          axis: alignmentPos == 1 ? "y" : "x"
        });
      }
    });

    d3cola
      .nodes(graph.nodes)
      .links(graph.links)
      .groups(graph.groups)
      .constraints(graph.constraints)
      .start();

    // define arrow markers for graph links
    outer.append('svg:defs').append('svg:marker')
      .attr('id', 'end-arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 5)
      .attr('markerWidth', 3)
      .attr('markerHeight', 3)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5L2,0')
      .attr('stroke-width', '0px')
      .attr('fill', '#000');

    var group = groupsLayer.selectAll(".group")
      .data(graph.groups)
      .enter().append("rect")
      .attr("rx", 8).attr("ry", 8)
      .attr("class", "group")
      .attr("style", function (d) {
        return d.style;
      });

    var link = linksLayer.selectAll(".link")
      .data(graph.links)
      .enter().append("line")
      .attr("class", "link");
    //var link = linksLayer.selectAll(".link")
    //    .data(graph.links)
    //  .enter().append('svg:path')
    //    .attr("class", "link");

    var margin = 6, pad = 12;
    var node = nodesLayer.selectAll(".node")
      .data(graph.nodes)
      .enter().append("rect")
      .attr("class", "node")
      .attr("width", function (d) {
        return d.width + 2 * pad + 2 * margin;
      })
      .attr("height", function (d) {
        return d.height + 2 * pad + 2 * margin;
      })
      .attr("rx", function (d) {
        return d.rx;
      }).attr("ry", function (d) {
        return d.rx;
      })
      .call(d3cola.drag);

    var label = nodesLayer.selectAll(".label")
      .data(graph.nodes)
      .enter().append("text")
      .attr("class", "label")
      .call(d3cola.drag);

    var insertLinebreaks = function (d) {
      var el = d3.select(this);
      var words = d.label.split(' ');
      el.text('');

      for (var i = 0; i < words.length; i++) {
        var tspan = el.append('tspan').text(words[i]);
        tspan.attr('x', 0).attr('dy', '15')
          .attr("font-size", "12");
      }
    };

    label.each(insertLinebreaks);

    node.append("title")
      .text(function (d) {
        return d.label;
      });

    d3cola.on("tick", function () {
      node.each(function (d) {
        d.innerBounds = d.bounds.inflate(-margin);
      });
      link.each(function (d) {
        d.route = cola.makeEdgeBetween(d.source.innerBounds, d.target.innerBounds, 5);
        if (isIE()) this.parentNode.insertBefore(this, this);
      });

      link.attr("x1", function (d) {
        return d.route.sourceIntersection.x;
      })
        .attr("y1", function (d) {
          return d.route.sourceIntersection.y;
        })
        .attr("x2", function (d) {
          return d.route.arrowStart.x;
        })
        .attr("y2", function (d) {
          return d.route.arrowStart.y;
        });

      label.each(function (d) {
        var b = this.getBBox();
        d.width = b.width + 2 * margin + 8;
        d.height = b.height + 2 * margin + 8;
      });

      node.attr("x", function (d) {
        return d.innerBounds.x;
      })
        .attr("y", function (d) {
          return d.innerBounds.y;
        })
        .attr("width", function (d) {
          return d.innerBounds.width();
        })
        .attr("height", function (d) {
          return d.innerBounds.height();
        });

      group.attr("x", function (d) {
        return d.bounds.x;
      })
        .attr("y", function (d) {
          return d.bounds.y;
        })
        .attr("width", function (d) {
          return d.bounds.width();
        })
        .attr("height", function (d) {
          return d.bounds.height();
        });

      label.attr("transform", function (d) {
        return "translate(" + d.x + margin + "," + (d.y + margin - d.height / 2) + ")";
      });
    });
  }
};

export default Graph;