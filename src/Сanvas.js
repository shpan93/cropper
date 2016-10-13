import React, { Component, PropTypes } from 'react';

import 'fabric';
export default class Canvas extends Component {
  static propTypes = {};
  static defaultProps = {};

  constructor(props) {
    super(props);
  }

  componentDidMount() {

    const canvas = new fabric.Canvas(document.getElementById('fabric-canvas'), {
      controlsAboveOverlay: true,
      selectionColor: 'rgba(255,106,0,0.2)',
      selectionLineWidth: 5,
      selection: false,
      originX: 'left',
      originY: 'top',
      borderColor: '#ff6a00',
      cornerColor: 'red',
      backgroundColor: 'rgba(255,255,255,0)'
    });
    this.props.onMount(canvas);
  }


  render() {
    return (
      <div onWheel={this.props.onWheel} >
        <canvas
          id="fabric-canvas"
                width={this.props.width}
                height={this.props.height}
        ></canvas>


      </div>
    )
  }
}