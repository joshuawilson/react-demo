import React, { Component } from 'react';
// import ReactDOM from "react-dom";
import Graph from './graph';
import '../styles/Controller.css';
// import Measure from 'react-measure';

/*
const measureElement = element => {
  const DOMNode = ReactDOM.findDOMNode(element);
  return {
    width: DOMNode.offsetWidth,
    height: DOMNode.offsetHeight,
  };
};
*/

export default class Controller extends Component {
  state = {
    graph: {},
    dimensions: {
      width: -1,
      height: -1,
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      graph: data,
      dimensions: {
        width: -1,
        height: -1,
      },
    };
    // this.measureRef = React.createRef()
  }

  componentDidMount() {

  }

  render() {
    return(
      <Graph graph={data} height={800} width={1000} />
    )
  }

/*
  onResize = contentRect => {
    this.setState({ dimensions: contentRect.bounds });
  };

  render() {
    const { width, height } = this.state.dimensions;
    // const className = classNames(width < 400 && 'small-width-modifier');

    return(
      <Measure offset >
        {({ measure, measureRef, contentRect }) => (
          <div ref={measureRef} className={"Controller"}>
            {contentRect.offset &&  <Graph graph={data} height={contentRect.offset.offsetHeight} width={contentRect.offset.offsetWidth} />}
          </div>
        )}
      </Measure>
    )
  }
*/
}

const data = {
  "nodes":[
    {"name":"a","width":60,"height":40},
    {"name":"b","width":60,"height":40},
    {"name":"c","width":60,"height":40},
    {"name":"d","width":60,"height":40},
    {"name":"e","width":60,"height":40},
    {"name":"f","width":60,"height":40},
    {"name":"g","width":60,"height":40}
  ],
  "links":[
    {"source":1,"target":2},
    {"source":2,"target":3},
    {"source":3,"target":4},
    {"source":0,"target":1},
    {"source":2,"target":0},
    {"source":3,"target":5},
    {"source":0,"target":5}
  ],
  "groups":[
    {"leaves":[0], "groups":[1]},
    {"leaves":[1,2]},
    {"leaves":[3,4]}
  ]
};

