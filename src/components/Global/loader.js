import React from 'react';
import { css } from 'react-emotion';

import { ClipLoader, PulseLoader, BarLoader } from 'react-spinners';

const containerCenter = css`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const container = css`
    flex: 1;
    display: flex;
    justify-content: center;
    padding-top: 5rem;
`;

const containerLeft = css`
    flex: 1;
    display: flex;
    align-items: center;
    padding-left: .8rem;
`;

const navigation = css`
    width: 100%;
    height: 4px;
    z-index: 1000;
`;

const navigationCenter = css`
    margin:2rem
`;

const Loader = ({type, propColor}) => {
    switch (type) {
        case "navigation":
        return (
            <div className={navigation}>
                <BarLoader
                    widthUnit={'%'}
                    width={100}
                    color={'#d32027'}
                    />
            </div>
        )
        case "navigation-center":
        return (
            <div className={navigationCenter}>
                <ClipLoader
                    sizeUnit={"rem"}
                    size={10}
                    color={'#d32027'}
                    />
            </div>
        )
        case "pulse":
        return (
            <div className={containerLeft}>
                <PulseLoader
                    sizeUnit={"rem"}
                    size={.8}
                    margin={"8px"}
                    color={propColor || 'var(--grey-dark)'}
                    />
            </div>
        )
        case "pulse-center":
        return (
            <div className={containerCenter}>
                <PulseLoader
                    sizeUnit={"rem"}
                    size={.8}
                    margin={"8px"}
                    color={propColor || 'var(--grey-dark)'}
                    />
            </div>
        )
        default:
        return (
            <div className={container}>
                <ClipLoader
                    sizeUnit={"rem"}
                    size={10}
                    color={'var(--primary)'}
                    />
            </div>
        )
    }
}

export default Loader;