import React, { useState } from 'react';

export interface DialProps {
    size: number,
    min: number,
    max: number,
    numTicks: number,
    degrees: number,
    value: number,
    color: boolean
}

export interface Pts {
    x: number,
    y: number
}

export const DialDefaultProps: DialProps = {
    size: 150,
    min: 10,
    max: 30,
    numTicks: 0,
    degrees: 270,
    value: 0,
    color: true
};

// This Dial is a function
export const Dial = (props: DialProps): JSX.Element => {

    const convertRange = (oldMin: number, oldMax: number, newMin: number, newMax: number, oldValue: number) => {
        return (oldValue - oldMin) * (newMax - newMin) / (oldMax - oldMin) + newMin;
    };
    const fullAngle = props.degrees;
    const startAngle = (360 - props.degrees) / 2;
    const endAngle = startAngle + props.degrees;
    const margin = props.size * 0.15;
    const [currentDeg, setCurrentDeg] = useState(Math.floor(
        convertRange(
            props.min,
            props.max,
            startAngle,
            endAngle,
            props.value
        )))

    const getDeg = (cX: number, cY: number, pts: Pts) => {
        const x = cX - pts.x;
        const y = cY - pts.y;
        let deg = Math.atan(y / x) * 180 / Math.PI;
        if ((x < 0 && y >= 0) || (x < 0 && y < 0)) {
            deg += 90;
        } else {
            deg += 270;
        }
        let finalDeg = Math.min(Math.max(startAngle, deg), endAngle);
        return finalDeg;
    };

    const startDrag = (e: any) => {
        e.preventDefault();
        const dial = e.target.getBoundingClientRect();
        const pts = {
            x: dial.left + dial.width / 2,
            y: dial.top + dial.height / 2
        };
        const moveHandler = (e: any) => {
            let currentDeg = getDeg(e.clientX, e.clientY, pts);
            if (currentDeg === startAngle) currentDeg--;
            let newValue = Math.floor(
                convertRange(
                    startAngle,
                    endAngle,
                    props.min,
                    props.max,
                    currentDeg
                )
            );
            //setCurrentDeg(newValue);
            setCurrentDeg(currentDeg);
            // props.onChange(newValue);
        };
        document.addEventListener("mousemove", moveHandler);
        document.addEventListener("mouseup", e => {
            document.removeEventListener("mousemove", moveHandler);
        });
    };

    const renderTicks = () => {
        let ticks = [];
        const incr = fullAngle / props.numTicks;
        const size = margin + props.size / 2;
        for (let deg = startAngle; deg <= endAngle; deg += incr) {
            const tick = {
                deg: deg,
                tickStyle: {
                    height: size + 10,
                    left: size - 1,
                    top: size + 2,
                    transform: "rotate(" + deg + "deg)",
                    transformOrigin: "top"
                }
            };
            ticks.push(tick);
        }
        return ticks;
    };

    const dcpy = (o: any) => {
        return JSON.parse(JSON.stringify(o));
    };

    let kStyle = {
        width: props.size,
        height: props.size
    };
    let iStyle = dcpy(kStyle);
    let oStyle = dcpy(kStyle);
    oStyle.margin = margin;
    if (props.color) {
        oStyle.backgroundImage =
            "radial-gradient(100% 70%,hsl(210, " +
            currentDeg +
            "%, " +
            currentDeg / 5 +
            "%),hsl(" +
            Math.random() * 100 +
            ",20%," +
            currentDeg / 36 +
            "%))";
    }
    iStyle.transform = "rotate(" + currentDeg + "deg)";

    return (
        <div className="dial" style={kStyle}>
            <div className="ticks">
                {props.numTicks
                    ? renderTicks().map((tick, i) => (
                        <div
                            key={i}
                            className={
                                "tick" + (tick.deg <= currentDeg ? " active" : "")
                            }
                            style={tick.tickStyle}
                        />
                    ))
                    : null}
            </div>
            <div className="dial outer" style={oStyle} onMouseDown={startDrag}>
                <div className="dial inner" style={iStyle}>
                    <div className="grip" />
                </div>
            </div>
        </div>
    );
}

/*
class Knob extends React.Component {
    constructor(props) {
        super(props);
        this.fullAngle = props.degrees;
        this.startAngle = (360 - props.degrees) / 2;
        this.endAngle = this.startAngle + props.degrees;
        this.margin = props.size * 0.15;
        this.currentDeg = Math.floor(
            this.convertRange(
                props.min,
                props.max,
                this.startAngle,
                this.endAngle,
                props.value
            )
        );
        this.state = { deg: this.currentDeg };
    }

    startDrag = e => {
        e.preventDefault();
        const knob = e.target.getBoundingClientRect();
        const pts = {
            x: knob.left + knob.width / 2,
            y: knob.top + knob.height / 2
        };
        const moveHandler = e => {
            this.currentDeg = this.getDeg(e.clientX, e.clientY, pts);
            if (this.currentDeg === this.startAngle) this.currentDeg--;
            let newValue = Math.floor(
                this.convertRange(
                    this.startAngle,
                    this.endAngle,
                    this.props.min,
                    this.props.max,
                    this.currentDeg
                )
            );
            this.setState({ deg: this.currentDeg });
            this.props.onChange(newValue);
        };
        document.addEventListener("mousemove", moveHandler);
        document.addEventListener("mouseup", e => {
            document.removeEventListener("mousemove", moveHandler);
        });
    };

    getDeg = (cX, cY, pts) => {
        const x = cX - pts.x;
        const y = cY - pts.y;
        let deg = Math.atan(y / x) * 180 / Math.PI;
        if ((x < 0 && y >= 0) || (x < 0 && y < 0)) {
            deg += 90;
        } else {
            deg += 270;
        }
        let finalDeg = Math.min(Math.max(this.startAngle, deg), this.endAngle);
        return finalDeg;
    };

    convertRange = (oldMin, oldMax, newMin, newMax, oldValue) => {
        return (oldValue - oldMin) * (newMax - newMin) / (oldMax - oldMin) + newMin;
    };

    renderTicks = () => {
        let ticks = [];
        const incr = this.fullAngle / this.props.numTicks;
        const size = this.margin + this.props.size / 2;
        for (let deg = this.startAngle; deg <= this.endAngle; deg += incr) {
            const tick = {
                deg: deg,
                tickStyle: {
                    height: size + 10,
                    left: size - 1,
                    top: size + 2,
                    transform: "rotate(" + deg + "deg)",
                    transformOrigin: "top"
                }
            };
            ticks.push(tick);
        }
        return ticks;
    };

    dcpy = o => {
        return JSON.parse(JSON.stringify(o));
    };

    render() {
        let kStyle = {
            width: this.props.size,
            height: this.props.size
        };
        let iStyle = this.dcpy(kStyle);
        let oStyle = this.dcpy(kStyle);
        oStyle.margin = this.margin;
        if (this.props.color) {
            oStyle.backgroundImage =
                "radial-gradient(100% 70%,hsl(210, " +
                this.currentDeg +
                "%, " +
                this.currentDeg / 5 +
                "%),hsl(" +
                Math.random() * 100 +
                ",20%," +
                this.currentDeg / 36 +
                "%))";
        }
        iStyle.transform = "rotate(" + this.state.deg + "deg)";

        return (
            <div className="knob" style={kStyle}>
                <div className="ticks">
                    {this.props.numTicks
                        ? this.renderTicks().map((tick, i) => (
                            <div
                                key={i}
                                className={
                                    "tick" + (tick.deg <= this.currentDeg ? " active" : "")
                                }
                                style={tick.tickStyle}
                            />
                        ))
                        : null}
                </div>
                <div className="knob outer" style={oStyle} onMouseDown={this.startDrag}>
                    <div className="knob inner" style={iStyle}>
                        <div className="grip" />
                    </div>
                </div>
            </div>
        );
    }
}
Knob.defaultProps = {
    size: 150,
    min: 10,
    max: 30,
    numTicks: 0,
    degrees: 270,
    value: 0
};

*/
