import styled from 'styled-components';
import { Translate } from 'react-i18nify';

const Style = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
`;

export default function Mobile() {
    return (
        <Style>
            <Translate value="MOBILE_TIP" />
        </Style>
    );
}
