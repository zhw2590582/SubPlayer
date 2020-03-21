import React from 'react';
import styled from 'styled-components';
import { Translate } from 'react-i18nify';

const Donate = styled.div`
    position: relative;
    padding: 0 20px 20px;
    font-size: 14px;

    a {
        color: #2196f3;
    }
`;

export default function() {
    return (
        <Donate>
            <p>
                <Translate value="donate-info" />
            </p>
            <p>Paypal:</p>
            <p>
                <a href="https://www.paypal.me/harveyzack">https://www.paypal.me/harveyzack</a>
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <p>
                        <Translate value="donate-weChatPay" />
                    </p>
                    <p>
                        <img style={{ width: 210 }} src="/wechatpay.jpg" alt="WeChat Pay" />
                    </p>
                </div>
                <div>
                    <p>
                        <Translate value="donate-alipay" />
                    </p>
                    <p>
                        <img style={{ width: 210 }} src="/alipay.jpg" alt="Alipay" />
                    </p>
                </div>
            </div>
        </Donate>
    );
}
