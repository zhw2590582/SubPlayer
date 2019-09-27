import React from 'react';
import styled from 'styled-components';
import language from '../utils/language';

const Wrapper = styled.div`
    flex: 1;
    padding: 10px;
`;

const Button = styled.button`
    height: 25px;
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
    state = {
        land: 'zh',
        language,
    };

    render() {
        return (
            <Wrapper>
                <Button onClick={() => this.props.updateSubtitle(this.props.subtitles.length)}>
                    <i className="icon-doc-new"></i>Add Subtitle
                </Button>
                <Button onClick={() => this.props.timeOffset(-0.1)}>
                    <i className="icon-minus"></i>Time Offset -100ms
                </Button>
                <Button onClick={() => this.props.timeOffset(0.1)}>
                    <i className="icon-plus"></i>Time Offset +100ms
                </Button>
                <Button onClick={() => this.props.undoSubtitle()}>
                    <i className="icon-ccw"></i>Undo
                </Button>
                <div />
                <Button onClick={this.props.removeAllSubtitle}>
                    <i className="icon-trash-empty"></i>Remove All Subtitle
                </Button>
                <Button onClick={this.props.removeEmptySubtitle}>
                    <i className="icon-trash-empty"></i>Remove Empty Subtitle
                </Button>
                <Button onClick={this.props.removeCache}>
                    <i className="icon-trash-empty"></i>Remove Cache
                </Button>
                <div />
                <Button onClick={() => this.props.translate(this.state.land)}>
                    <i className="icon-language"></i>Batch Translate
                </Button>
                <span
                    style={{
                        marginRight: 10,
                    }}
                >
                    To
                </span>
                <Select
                    value={this.state.land}
                    onChange={event => {
                        this.setState({ land: event.target.value });
                    }}
                >
                    {this.state.language.map(item => (
                        <option key={item.key} value={item.key}>
                            {item.name}
                        </option>
                    ))}
                </Select>
            </Wrapper>
        );
    }
}
