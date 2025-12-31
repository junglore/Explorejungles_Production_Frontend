import React, { useState } from "react";

export const SquareCheckboxSolid = ({
    className = "",
    color = "#2C73EB",
    checked: controlledChecked,
    onChange
}) => {
    const [internalChecked, setInternalChecked] = useState(false);

    // Use controlled checked state if provided, otherwise use internal state
    const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked;

    const handleClick = () => {
        const newChecked = !isChecked;

        if (onChange) {
            onChange(newChecked);
        } else {
            setInternalChecked(newChecked);
        }
    };

    return (
        <div
            className={`square-checkbox-solid ${className}`}
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
        >
            <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <rect
                    x="1"
                    y="1"
                    width="18"
                    height="18"
                    rx="2"
                    fill={isChecked ? color : "transparent"}
                    stroke={color}
                    strokeWidth="2"
                />
                {isChecked && (
                    <path
                        d="M6 10L8.5 12.5L14 7"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                )}
            </svg>
        </div>
    );
}; 