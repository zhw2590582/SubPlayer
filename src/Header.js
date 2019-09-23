import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.header`
    height: 50px;
    border-bottom: 1px solid rgb(17, 21, 24);
    background-color: rgb(28, 32, 34);
`;

export default function Header() {
    return <Wrapper>Header</Wrapper>;
}
