import React from 'react';
import PropTypes from 'prop-types';
import AvatarEditor from 'react-avatar-editor';

/**
 * ImageCrop Component
 *
 * This component allows users to crop and scale an image using the 'react-avatar-editor' library.
 *
 * @param {object} props - The properties passed to the component.
 * @param {string} props.imageSrc - The source URL of the image to be cropped and scaled.
 * @param {function} props.onCrop - A callback function invoked when the user clicks the "Save" button.
 * @param {function} props.setEditorRef - A function to set a reference to the AvatarEditor component.
 * @param {number} props.scaleValue - The current scale value for the image.
 * @param {function} props.onScaleChange - A callback function invoked when the user changes the scale using the input range.
 * @return {JSX.Element} - The rendered ImageCrop component.
 */
const ImageCrop = ({imageSrc, onCrop, setEditorRef, scaleValue, onScaleChange}) => (
  <div>
    <div className="editorOverlayInner">
      <div className="editorModalContent clearfix">
        <div className="cropCnt mt-2">
          <AvatarEditor image={imageSrc} border={10} width={272} height={272} scale={scaleValue} rotate={0} ref={setEditorRef} className="cropCanvas" />
          <input style={{width: '100%'}} type="range" value={scaleValue} name="points" min="1" max="10" onChange={onScaleChange} />
          <button onClick={onCrop} className="border-2 dark:border-customBlack2 p-2 rounded-lg dark:bg-customBlack dark:text-lightBG hover:scale-105 font-semibold">
              Save
          </button>
        </div>
      </div>
    </div>
  </div>
);

// PropTypes for type checking and documentation purposes
ImageCrop.propTypes = {
  open: PropTypes.bool.isRequired,
  setEditorRef: PropTypes.func.isRequired,
  onCrop: PropTypes.func.isRequired,
  scaleValue: PropTypes.number.isRequired,
  onScaleChange: PropTypes.func.isRequired,
};

export default ImageCrop;
