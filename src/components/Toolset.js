import React from 'react';
import styled from 'styled-components';
import { Translate } from 'react-i18nify';
import languages from '../utils/languages';

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
    background-color: rgb(46, 54, 60);
    transition: all 0.2s ease;

    &:hover {
        color: #fff;
        background-color: rgb(66, 82, 95);
    }

    i {
        margin-right: 5px;
    }
`;

const Select = styled.select`
    height: 25px;
    border: none;
    padding: 0 10px;
    outline: none;
    border-radius: 2px;
    font-size: 13px;
    margin: 0 10px 10px 0;
    color: #ccc;
    background-color: rgb(46, 54, 60);
`;

export default class Player extends React.Component {
    state = {
        lang: 'en',
        translator: 'google',
        translators: {
            zh: [
                {
                    name: '谷歌翻译',
                    key: 'google',
                },
                {
                    name: '百度翻译',
                    key: 'baidu',
                },
            ],
            en: [
                {
                    name: 'Google Translate',
                    key: 'google',
                },
                {
                    name: 'Baidu Translate',
                    key: 'baidu',
                },
            ],
            es: [
                {
                    name: 'Traductor de google',
                    key: 'google',
                },
                {
                    name: 'Traductor de baidu',
                    key: 'baidu',
                },
            ],
        },
        languages,
    };

    render() {
        const {
            lang,
            subtitles,
            overallOffset,
            insertSubtitle,
            timeOffset,
            undoSubtitle,
            removeAllSubtitle,
            removeEmptySubtitle,
            removeCache,
            translate,
            overallOffsetSwitch,
        } = this.props;
        return (
            <Wrapper>
                <Button onClick={() => insertSubtitle(subtitles.length)}>
                    <i className="icon-doc-new"></i>
                    <Translate value="btnAddSubtitle" />
                </Button>
                <Button onClick={() => timeOffset(-0.1)}>
                    <i className="icon-minus"></i>
                    <Translate value="btnTimeOffsetMinus" />
                </Button>
                <Button onClick={() => timeOffset(0.1)}>
                    <i className="icon-plus"></i>
                    <Translate value="btnTimeOffsetPlus" />
                </Button>
                <Button onClick={() => undoSubtitle()}>
                    <i className="icon-ccw"></i>
                    <Translate value="btnUndo" />
                </Button>
                <div />
                <Button onClick={() => removeAllSubtitle()}>
                    <i className="icon-trash-empty"></i>
                    <Translate value="btnRemoveAll" />
                </Button>
                <Button onClick={() => removeEmptySubtitle()}>
                    <i className="icon-trash-empty"></i>
                    <Translate value="btnRemoveEmpty" />
                </Button>
                <Button onClick={() => removeCache()}>
                    <i className="icon-trash-empty"></i>
                    <Translate value="btnRemoveCache" />
                </Button>
                <div />
                <Button onClick={() => translate(this.state.lang, this.state.translator)}>
                    <i className="icon-language"></i>
                    <Translate value="btnBatchTranslate" />
                </Button>
                <span
                    style={{
                        marginRight: 10,
                    }}
                >
                    <Translate value="use" />
                </span>
                <Select
                    value={this.state.translator}
                    onChange={event => {
                        this.setState({ lang: 'en', translator: event.target.value });
                    }}
                >
                    {this.state.translators[lang].map(item => (
                        <option key={item.key} value={item.key}>
                            {item.name}
                        </option>
                    ))}
                </Select>
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
                    {this.state.languages[this.state.translator][lang].map(item => (
                        <option key={item.key} value={item.key}>
                            {item.name}
                        </option>
                    ))}
                </Select>
                <div />
                <Button onClick={() => overallOffsetSwitch()}>
                    <i className="icon-switch"></i>
                    <Translate value="btnOverallOffset" />:{' '}
                    {overallOffset ? <Translate value="on" /> : <Translate value="off" />}
                </Button>
            </Wrapper>
        );
    }
}
