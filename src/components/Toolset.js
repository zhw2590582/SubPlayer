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
    state = {
        land: 'zh-CN',
    };

    render() {
        return (
            <Wrapper>
                <Button onClick={() => this.props.addSubtitle(this.props.subtitles.length)}>
                    <i className="icon-doc-new"></i>Add Subtitle
                </Button>
                <Button onClick={() => this.props.timeOffset(-0.5)}>
                    <i className="icon-minus"></i>Time Offset -500ms
                </Button>
                <Button onClick={() => this.props.timeOffset(0.5)}>
                    <i className="icon-plus"></i>Time Offset +500ms
                </Button>
                <Button onClick={this.props.removeAllSubtitle}>
                    <i className="icon-trash-empty"></i>Remove All Subtitle
                </Button>
                <Button onClick={this.props.removeEmptySubtitle}>
                    <i className="icon-doc-remove"></i>Remove Empty Subtitle
                </Button>
                <div />
                <Button onClick={() => this.props.googleTranslate(this.state.land)}>
                    <i className="icon-google"></i>Batch Google Translate
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
                    <option value="zh-CN">Chinese Simplified</option>
                    <option value="zh-TW">Chinese Traditional</option>
                    <option value="en">English</option>
                    <option value="ja">Japanese</option>
                    <option value="ru">Russian</option>
                    <option value="de">German</option>
                    <option value="fr">French</option>
                </Select>
            </Wrapper>
        );
    }
}
