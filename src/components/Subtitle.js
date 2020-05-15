import React, { useEffect, useState, useCallback } from 'react';
import styled from 'styled-components';
import { Table } from 'react-virtualized';
import debounce from 'lodash/debounce';
import unescape from 'lodash/unescape';
import clamp from 'lodash/clamp';
import { timeToSecond, secondToTime } from '../utils';
import { fixTime } from '../subtitle/index'
import { notify } from '../utils/index'

const Subtitle = styled.div`
    .ReactVirtualized__Table {
        font-size: 12px;
        .ReactVirtualized__Table__Grid {
            outline: none;
        }
        .ReactVirtualized__Table__row {
            transition: all 0.2s ease;
            &.odd {
                background-color: rgb(35, 40, 64);
            }
            &.highlight {
                background-color: #2196f3;
            }
            &.illegal {
                background-color: #c75123;
            }
            .row {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                color: #fff;
                height: 100%;
                padding: 10px 5px;
                border-bottom: 1px solid #000;
            }
        }

        .input,
        .textarea {
            border: none;
            width: 100%;
            color: #fff;
            font-size: 12px;
            text-align: center;
            background-color: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.1);
            resize: none;
            outline: none;
        }

        .input {
            height: 25px;
            line-height: 25px;
            cursor: col-resize;
            user-select: none;
        }

        .textarea {
            padding: 5px;
            height: 100%;
            line-height: 1.5;
            
        }
        .textareaa {
            border: none;
            width: 100%;
            color: #fff;
            font-size: 12px;
            text-align: center;
            background-color: rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.1);
            resize: none;
            outline: none;
            ${'' /* padding: 5px;
            height: 100%;
            line-height: 1.5; */}
            
        }

        .operation {
            i {
                font-size: 12px;
                cursor: pointer;
            }
        }
    }
`;

export default function ({
    player,
    subtitles,
    addSubtitle,
    currentIndex,
    updateSubtitle,
    removeSubtitle,
    translateSubtitle,
    checkSubtitle,
}) {
    let isDroging = false;
    let lastPageX = 0;
    let lastSub = null;
    let lastKey = '';
    let lastValue = '';
    const [checkedSubs, setCheckedSubs] = useState([]);
    const [checkedIndex, setCheckedIndex] = useState([]);
    window.loopStart = null;
    window.loopEnd = null;

    function onMouseDown(event, sub, key) {
        isDroging = true;
        lastPageX = event.pageX;
        lastSub = sub;
        lastKey = key;
    }

    function onMouseMove(event, sub, key) {
        if (isDroging) {
            const time = Number(((event.pageX - lastPageX) / 10).toFixed(3));
            lastValue = secondToTime(clamp(timeToSecond(sub[key]) + time, 0, Infinity));
        }
    }

    // update after a while


    function onMouseUp() {
        if (isDroging) {
            if (lastSub && lastKey && lastValue) {
                updateSubtitle(lastSub, lastKey, lastValue);
            }
            isDroging = false;
            lastPageX = 0;
            lastSub = null;
            lastKey = '';
            lastValue = '';
        }
    }

    const [width, setWidth] = useState(100);
    const [height, setHeight] = useState(100);

    const resize = useCallback(() => {
        setWidth(document.body.clientWidth / 2);
        setHeight(document.body.clientHeight - 210);
    }, [setWidth, setHeight]);

    useEffect(() => {
        resize();
        if (!resize.init) {
            resize.init = true;
            const debounceResize = debounce(resize, 500);
            window.addEventListener('resize', debounceResize);
        }
    }, [resize]);

    return (
        <Subtitle>
            <Table
                headerHeight={40}
                width={width}
                height={height}
                rowHeight={80}
                scrollToIndex={currentIndex}
                rowCount={subtitles.length}
                rowGetter={({ index }) => subtitles[index]}
                headerRowRenderer={() => null}
                rowRenderer={props => {
                    return (
                        <div
                            key={props.key}
                            className={[
                                props.className,
                                props.index % 2 ? 'odd' : '',
                                currentIndex === props.index ? 'highlight' : '',
                                checkedIndex.includes(props.index) ? 'highlight' : '',
                                checkSubtitle(props.rowData) ? 'illegal' : '',
                            ]
                                .join(' ')
                                .trim()}
                            style={props.style}
                            onClick={() => {
                                player.pause = true;
                                if (player.duration >= props.rowData.startTime) {
                                    player.seek = props.rowData.startTime + 0.001;
                                }
                            }}
                        >
                            <div className="row operation" style={{ width: 30 }}>
                                <i
                                    className="icon-trash-empty"
                                    onClick={() => removeSubtitle(props.rowData)}
                                    style={{ marginBottom: 5 }}
                                ></i>



                                <input
                                    type="checkbox"
                                    id={'check' + props.index}
                                    name={props.rowData.text}
                                    value={props.rowData.text}
                                    onChange={(e) => {
                                        if (e.target.checked === true) {
                                            //adding to the selected Array
                                            checkedSubs.push(props.rowData);
                                            //sort the array
                                            checkedSubs.sort((a, b) => {
                                                return a['start'].localeCompare(b['start']);
                                            })
                                            // adding blue color 
                                            let subDiv = document.getElementById('check' + props.index).parentElement.parentElement;
                                            subDiv.classList.add('highlight');
                                            // adding to checked index
                                            checkedIndex.push(props.index)
                                            // managing loops
                                            window.loopStart = checkedSubs[0].start;
                                            window.loopEnd = checkedSubs[checkedSubs.length - 1].end;
                                            console.log('checked start', window.loopStart)
                                            console.log('checked end', window.loopEnd)
                                            console.log(checkedSubs) 
                                        }

                                        if (e.target.checked === false) {
                                            //removing from checked Subs
                                            let i = checkedSubs.indexOf(props.rowData)
                                            checkedSubs.splice(i, 1);

                                            // removing from checked index
                                            let j = checkedIndex.indexOf(props.index)
                                            checkedIndex.splice(j, 1)
                                            // managing loops
                                            window.loopStart = checkedSubs.length > 0 ? checkedSubs[0].start : null;
                                            window.loopEnd = checkedSubs.length > 0 ? checkedSubs[checkedSubs.length - 1].end : null;

                                            console.log('unchecked start', window.loopStart)
                                            console.log('unchecked end', window.loopEnd)
                                            console.log(checkedSubs) 

                                        }


                                    }
                                    }
                                />




                                <i
                                    className="icon-language"
                                    onClick={() => translateSubtitle(props.rowData)}
                                    style={{ marginBottom: 5 }}
                                ></i>
                                <i className="icon-plus" onClick={() => addSubtitle(props.index + 1)}></i>
                            </div>
                            <div className="row time" style={{ width: 150 }} onMouseUp={onMouseUp}>
                                {/* <input
                                    // className="input"
                                    // onMouseDown={event => onMouseDown(event, props.rowData, 'start')}
                                    // onMouseMove={event => onMouseMove(event, props.rowData, 'start')}
                                    style={{ marginBottom: 10 }}
                                    onKeyDown ={ (e)=>{
                                        console.log(e.key)
                                        if(e.key === 'Enter'){
                                        console.log('start', props.rowData.start)
                                        console.log('start time',props.rowData.startTime)
                                        console.log(e.target.value)
                                        props.rowData.start = timeToSecond(e.target.value)
                                        e.target.innerText = props.rowData.startTime
                                        }
                                    } }
                                    value = {props.rowData.start}
                                /> */}
                                <textarea rows="1"

                                    className="textareaa"
                                    // onMouseDown={event => onMouseDown(event, props.rowData, 'start')}
                                    // onMouseMove={event => onMouseMove(event, props.rowData, 'start')}
                                    id={'startTextArea' + props.index}
                                    style={{ marginBottom: 10 }}
                                    onChange={
                                        (e) => {
                                            let startInner = document.getElementById('startTextArea' + props.index)
                                            startInner.value = e.target.value.replace(/(\r\n|\n|\r)/gm, "");

                                        }
                                    }

                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {

                                            try {
                                                updateSubtitle(props.rowData, 'start', e.target.value)
                                            } catch (err) {
                                                // (err) => {  alert('error') }
                                             //   alert(err)
                                                notify('wrong Time format, please use the format "00:00:00.000" and your Time does not exceed the End time ', 'error', 5000)
                                                let startInner = document.getElementById('startTextArea' + props.index)
                                                startInner.value = props.rowData.start
                                                return;
                                            }

                                        }
                                    }
                                    }
                                    //value = {props.rowData.start}
                                >
                                    {props.rowData.start}
                                </textarea>

                               

                                <textarea rows="1"

                                    className="textareaa"
                                    // onMouseDown={event => onMouseDown(event, props.rowData, 'end')}
                                    // onMouseMove={event => onMouseMove(event, props.rowData, 'end')}
                                    id={'endTextArea' + props.index}
                                    style={{ marginBottom: 10 }}
                                    onChange={
                                        (e) => {
                                            let endInner = document.getElementById('endTextArea' + props.index)
                                            endInner.value = e.target.value.replace(/(\r\n|\n|\r)/gm, "");

                                        }
                                    }

                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {

                                            try {
                                                updateSubtitle(props.rowData, 'end', e.target.value)
                                            } catch (err) {
                                                // (err) => {  alert('error') }
                                               // alert(err)
                                                notify('wrong Time format, please use the format "00:00:00.000" and your Time does not exceed the End time ')
                                                let endInner = document.getElementById('endTextArea' + props.index)
                                                endInner.value = props.rowData.end
                                                return;
                                            }

                                        }
                                    }
                                    }

                                >
                                    {props.rowData.end}
                                </textarea>
                            </div>
                            <div className="row duration" style={{ width: 70 }}>
                                {props.rowData.duration}
                            </div>
                            <div className="row text" style={{ flex: 1 }}>
                                <textarea
                                    maxLength={200}
                                    spellCheck={false}
                                    className="textarea"
                                    value={unescape(props.rowData.text)}
                                    onChange={event => updateSubtitle(props.rowData, 'text', event.target.value)}
                                />
                            </div>
                        </div>
                    );
                }}
            ></Table>
        </Subtitle>
    );
}
