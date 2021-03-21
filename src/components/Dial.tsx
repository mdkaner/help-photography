import React from 'react';

export interface DialProps {
    min: number;
    max: number;
}

export const Dial = (props: DialProps): JSX.Element => {
    return <div>
        I'm a happy Dial
    </div>
}