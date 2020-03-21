import React from 'react';
import styled from 'styled-components';

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
                Or you can buy me a cup of coffee to encourage me to continue to update and improve the subtitle editor.
            </p>
            <p>Paypal:</p>
            <p>
                <a href="https://www.paypal.me/harveyzack">https://www.paypal.me/harveyzack</a>
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <p>WeChat Pay:</p>
                    <p>
                        <img style={{ width: 210 }} src="/wechatpay.jpg" alt="WeChat Pay" />
                    </p>
                </div>
                <div>
                    <p>Alipay:</p>
                    <p>
                        <img style={{ width: 210 }} src="/alipay.jpg" alt="Alipay" />
                    </p>
                </div>
            </div>
        </Donate>
    );
}
