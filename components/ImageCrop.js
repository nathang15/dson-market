import React from 'react';
import PropTypes from 'prop-types';
import AvatarEditor from 'react-avatar-editor';

const ImageCrop = ({ imageSrc, onCrop, setEditorRef, scaleValue, onScaleChange }) => (
  <div>
      <div className="editorOverlayInner">
        <div className="editorModalContent clearfix">
          <div className="cropCnt mt-2">
            <AvatarEditor image={imageSrc} border={10} width={450} height={450} scale={scaleValue} rotate={0} ref={setEditorRef} className="cropCanvas" />
            <input style={{ width: '100%' }} type="range" value={scaleValue} name="points" min="1" max="10" onChange={onScaleChange} />
            <button onClick={onCrop} className="border-2 dark:border-customBlack2 p-2 rounded-lg dark:bg-customBlack dark:text-lightBG hover:scale-105 font-semibold">
              Save
            </button>
          </div>
        </div>
      </div>
  </div>
);

ImageCrop.propTypes = {
  open: PropTypes.bool.isRequired,
  setEditorRef: PropTypes.func.isRequired,
  onCrop: PropTypes.func.isRequired,
  scaleValue: PropTypes.number.isRequired,
  onScaleChange: PropTypes.func.isRequired,
};

export default ImageCrop;