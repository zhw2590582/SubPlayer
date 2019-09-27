import React from 'react';
import styled from 'styled-components';
import { Translate } from 'react-i18nify';
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
        lang: 'zh',
        language,
    };

    render() {
        return (
            <Wrapper>
                <Button onClick={() => this.props.updateSubtitle(this.props.subtitles.length)}>
                    <i className="icon-doc-new"></i>
                    <Translate value="btnAddSubtitle" />
                </Button>
                <Button onClick={() => this.props.timeOffset(-0.1)}>
                    <i className="icon-minus"></i>
                    <Translate value="btnTimeOffsetMinus" />
                </Button>
                <Button onClick={() => this.props.timeOffset(0.1)}>
                    <i className="icon-plus"></i>
                    <Translate value="btnTimeOffsetPlus" />
                </Button>
                <Button onClick={() => this.props.undoSubtitle()}>
                    <i className="icon-ccw"></i>
                    <Translate value="btnUndo" />
                </Button>
                <div />
                <Button onClick={this.props.removeAllSubtitle}>
                    <i className="icon-trash-empty"></i>
                    <Translate value="btnRemoveAll" />
                </Button>
                <Button onClick={this.props.removeEmptySubtitle}>
                    <i className="icon-trash-empty"></i>
                    <Translate value="btnRemoveEmpty" />
                </Button>
                <Button onClick={this.props.removeCache}>
                    <i className="icon-trash-empty"></i>
                    <Translate value="btnRemoveCache" />
                </Button>
                <div />
                <Button onClick={() => this.props.translate(this.state.lang)}>
                    <i className="icon-language"></i>
                    <Translate value="btnBatchTranslate" />
                </Button>
                <span
                    style={{
                        marginRight: 10,
                    }}
                >
                    <Translate value="to" />
                </span>
                <Select
                    value={this.state.lang}
                    onChange={event => {
                        this.setState({ lang: event.target.value });
                    }}
                >
                    {this.state.language['zh'].map(item => (
                        <option key={item.key} value={item.key}>
                            {item.name}
                        </option>
                    ))}
                </Select>
            </Wrapper>
        );
    }
}
