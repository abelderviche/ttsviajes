import React from 'react';

const formPlaceholder = (rows, headlines) => {
    return (
        <div className="ph-item">
            <div className="ph-col-12">
                {Array.apply(null, { length: headlines }).map((v,k) => {
                    return (
                        <div className="ph-row">
                            <div className="ph-col-2"></div>
                            <div className="ph-col-10 empty"></div>
                        </div>
                    )
                })}
                <div>
                {Array.apply(null, {length: rows}).map(() => {
                    return (
                        <div className="ph-row ph-container">
                            <div className="ph-col-3 big"></div>
                            <div className="ph-col-3 big"></div>
                            <div className="ph-col-3 big"></div>
                        </div>
                    )
                })}
                </div>
            </div>
        </div>
    )
}

const CheckoutPlaceholder = () => {
    return (
        <div className="checkout-container">
            <div className="section-title">
                <div className="ph-row ph-container">
                    <div className="ph-col-6 big"></div>
                    <div className="ph-col-4 empty"></div>
                </div>
            </div>
            <div className="section-checkout">
                <div className="form">
                    {formPlaceholder(3, 2)}
                    {formPlaceholder(2, 1)}
                    {formPlaceholder(2, 1)}
                </div>
                <div className="summary">
                    <div className="ph-picture">
                    </div>
                    <div className="ph-picture">
                    </div>
                    <div className="ph-picture">
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckoutPlaceholder;