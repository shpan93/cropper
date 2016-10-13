import React, { Component } from 'react';
import Canvas from './Сanvas';
import 'babel-polyfill';
const defaultOptions = {
  width: 500,
  height: 500,
  rectOptions: {
    left: 100,
    top: 0,
    height: 500,
    width: 400,
    fill: '#fff'
  },
  imgUrl: 'dyno1.png',
  result:'png',
  onSave: function (result) {},


};
export default class Cropper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        ...defaultOptions,
        ...this.props.options
      },
      canvas: null,
      img: null,
      rect: null
    };
  }

  componentDidMount() {

  }

  handleCanvasMount(canvas) {
    this.setState({
      canvas
    }, () => {
      function render() {
        // _self.staticCanvas.renderAll();
        if (canvas) {
          canvas.renderAll()
        }
        fabric.util.requestAnimFrame(render);
      }

      render();

      this.createImage();
      this.createRect();
    });

  }

  createImage() {
    const { width, height } = this.state.options;
    fabric.Image.fromURL(this.state.options.imgUrl, (img) => {
      let minScale = 1;
      const orientation = this.getOrientation(img.width, img.height);
      if (img.width > width || img.height > height) {
        switch (orientation) {
          case 'PORTRAIT':
            minScale = width / img.width;
            if (minScale * img.height < height) {
              minScale = height / img.height;
            }
            break;
          case 'ALBUM':
            minScale = height / img.height;
            if (minScale * img.width < width) {
              minScale = width / img.width;
            }
            break;
        }
      }

      img.set({
        originX: 'center',
        originY: 'center',
        left: this.state.options.width / 2,
        top: this.state.options.height / 2,
        scaleX: minScale,
        scaleY: minScale
      });

    //  console.log(minScale, img.height * minScale, img.width * minScale)

      this.setState({
        img,
        imageLoaded: true
      });
      this.state.canvas.add(img);
      this.state.canvas.bringToFront(img);
    });
  }

  getOrientation(width, height) {
    return width <= height ? 'PORTRAIT' : 'ALBUM';
  }

  createRect() {
    var rect = new fabric.Rect({
      ...this.state.options.rectOptions,
      originX: 'left',
      originY: 'top',
      selectable: false
    });
    this.setState({
      rect
    });
    this.state.canvas.add(rect);

  }

  addWheel(e) {
    this.onWheel({
      deltaY: 1
    }, 0.025);
    e && e.preventDefault();
  }

  reduceWheel(e) {
    this.onWheel({
      deltaY: -1
    }, 0.025);
    e && e.preventDefault();
  }

  flip(e) {
    if (this.state.canvas._activeObject) {
      if (this.state.canvas._activeObject.flipX === true) {
        this.state.canvas._activeObject.set('flipX', false);
      } else {
        this.state.canvas._activeObject.set('flipX', true);
      }
    }
    e &  e.preventDefault();
  }
  rotate(e) {
    e.preventDefault();
    var _self = this;
    let angleOffset = 90;
    if (this.state.canvas._activeObject) {


      var obj = this.state.canvas.getActiveObject(),
        resetOrigin = false;

      if (!obj) return;

      var angle = obj.getAngle() + angleOffset;

      if ((obj.originX !== 'center' || obj.originY !== 'center') && obj.centeredRotation) {
        obj.setOriginToCenter && obj.setOriginToCenter();
        resetOrigin = true;
      }

      angle = angle > 360 ? 90 : angle < 0 ? 270 : angle;

      obj.setAngle(angle).setCoords();

      if (resetOrigin) {
        obj.setCenterToOrigin && obj.setCenterToOrigin();
      }

    }
  }
  onWheel(e) {
    const factor = 0.02;
    let step = 0.1;
    var _self = this;
   // console.log(arguments)
    if (!this.state.canvas._activeObject) {
      return false;
    }


    if (this.state.canvas._activeObject) {
      let currentZoomX = this.state.canvas._activeObject.getScaleX();
      let scaleTo = (x) => {
        this.state.canvas._activeObject.setScaleX(x);
        this.state.canvas._activeObject.setScaleY(x);
      };

      var delta = e.deltaY > 0 ? 1 : -1;


      let appliedZoom = currentZoomX + delta * step;
      if (appliedZoom > 0) {
        scaleTo(appliedZoom);
      }

      this.state.canvas.trigger('object:scaling');
    }
  }

  getCanvasResultImage() {
    this.state.canvas.discardActiveObject();
    return this.state.canvas.toDataURL(this.state.result);
  }
  saveImage(){
    let b64 = this.getCanvasResultImage();
    this.state.options.onSave(b64);
  }
  render() {

    const { width, height } = this.state.options;

    return (
      <div>
        <Canvas width={width} height={height}
                onMount={::this.handleCanvasMount}
                onWheel={::this.onWheel} />
        <div className="btn-wr">
          <button onClick={::this.addWheel}> + </button>
          <button onClick={::this.reduceWheel}> - </button>
          <button onClick={::this.rotate}> rotate </button>
          <button onClick={::this.flip}> flip </button>
        </div>  <div className="btn-wr">
          <button onClick={::this.saveImage}>Save image</button>
        </div>
      </div>

    )
  }
}