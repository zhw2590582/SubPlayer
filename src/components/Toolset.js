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

    i {
        margin-right: 5px;
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
                <Button onClick={() => this.props.addSubtitle()}>
                    <i className="icon-doc-new"></i>Add Subtitle
                </Button>
                <Button>
                    <i className="icon-minus"></i>Time Offset -100ms
                </Button>
                <Button>
                    <i className="icon-plus"></i>Time Offset +100ms
                </Button>
                <Button onClick={this.props.removeAllSubtitle}>
                    <i className="icon-trash-empty"></i>Remove All Subtitle
                </Button>
                <Button onClick={this.props.removeEmptySubtitle}>
                    <i className="icon-doc-remove"></i>Remove Empty Subtitle
                </Button>
                <div />
                <Button>
                    <i className="icon-google"></i>Batch Google Translate
                </Button>
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
