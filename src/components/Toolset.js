import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    flex: 1;
    padding: 10px;
`;

const Button = styled.button`
    height: 30px;
    border: none;
    padding: 0 10px;
    outline: none;
    cursor: pointer;
    border-radius: 2px;
    font-size: 13px;
    margin: 0 10px 10px 0;
    color: #ccc;
    background-color: rgb(39, 41, 54);
    transition: all 0.2s ease;

    &:hover {
        color: #fff;
        background-color: rgb(51, 54, 76);
    }
`;

const Select = styled.select`
    height: 30px;
    border: none;
    padding: 0 10px;
    outline: none;
    border-radius: 2px;
    font-size: 13px;
    margin: 0 10px 10px 0;
    color: #ccc;
    background-color: rgb(39, 41, 54);
`;

export default class Player extends React.Component {
    render() {
        return (
            <Wrapper>
                <Button>Add Subtitle</Button>
                <Button>Time Offset -100ms</Button>
                <Button>Time Offset +100ms</Button>
                <Button>Remove Empty Subtitle</Button>
                <div />
                <Button>Batch Google Translate</Button>
                <Select>
                    <option>中文</option>
                </Select>
                <span
                    style={{
                        marginRight: 10,
                    }}
                >
                    To
                </span>
                <Select>
                    <option>English</option>
                </Select>
            </Wrapper>
        );
    }
}
