import React from 'react';
import styled from 'styled-components';

const Header = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    background-color: #30324a;
`;

const Left = styled.div`
    padding-left: 10px;
`;

const Right = styled.div`
    padding-right: 10px;
`;

const Logo = styled.a`
    font-size: 16px;
    color: #fff;
    text-decoration: none;
    margin-right: 10px;
`;

export default function() {
    return (
        <Header>
            <Left>
                <Logo href="/">SubPlayer</Logo>
            </Left>
            <Right>Right</Right>
        </Header>
    );
}
