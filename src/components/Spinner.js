import React, { useState } from 'react';
import { css } from '@emotion/react';
import { BeatLoader } from 'react-spinners';

const Spinner = ({ loading }) => {
  const override = css`
    display: block;
    margin: 0 auto;
  `;

  return (
    <div className="sweet-loading">
      <BeatLoader color="#36D7B7" loading={loading} css={override} size={15} />
    </div>
  );
};

export default Spinner;
